import { createElement, ReactChildren } from 'react'
import allElements from './elements'

type ClassNameEntry = string | ClassNameComponent

type ClassNameLiteral = [
  strings: TemplateStringsArray,
  expressions?: string[] | ((props: any) => string | undefined) | string
]

interface ClassNameAttributes {
  className?: string
  literal?: ClassNameLiteral
}

interface ClassNameComponent {
  (props: any): React.ReactElement
  attrs?: ClassNameAttributes
}

interface ClassNameProps {
  children: ReactChildren
  as: ClassNameEntry
}

const parseExpression = (props: any, ex: any = '') => {
  return typeof ex === 'function' ? ex(props) : ex
}

const parseLiteralWithProps = (
  props: any,
  [strings, expressions]: ClassNameLiteral
) =>
  strings
    .map(
      (stringItem, index) =>
        stringItem +
        parseExpression(
          props,
          Array.isArray(expressions) ? expressions?.[index] : expressions
        )
    )
    .join(' ')

  const parseProps = (props: any) => {
    return Object.entries(props).reduce((acc, [key, value]: [string, any]) => {
      acc[key] = value;

      // prevent "Warning: Received "true" for a non-boolean attribute" error
      // message
      if (typeof value === 'boolean') {
        acc[key] = +value;
      }

      return acc
    }, {} as Record<string, any>)
  }

export const withClass = (
  tag: string | ClassNameComponent,
  classes: string,
  literalArgs?: ClassNameLiteral
): ClassNameComponent => {
  const ClassNameComponent = ({ as, ...callProps }: ClassNameProps) => {
    const { children, ...props } = callProps
    const attrs: ClassNameAttributes =
      typeof tag !== 'string' ? tag.attrs || {} : {}
    const parentResult = attrs?.literal
      ? parseLiteralWithProps(callProps, attrs.literal)
      : ''
    const literalResult = literalArgs
      ? parseLiteralWithProps(callProps, literalArgs)
      : ''

    return createElement(
      as || tag,
      {
        className: [
          attrs?.className,
          classes,
          parentResult,
          literalResult,
        ].join(' '),
        ...parseProps(props),
      },
      children
    )
  }

  ClassNameComponent.attrs = {
    className: classes,
    // TODO this can probably be done more elegantly/terser by normalizing
    // `classes` to just be literalArgs too.
    literal: literalArgs,
  }

  return ClassNameComponent
}

/**
 * Create a new primitive component with a predefined set of className
 */
const makeComponent =
  (tag: ClassNameEntry) =>
  (...literalArgs: ClassNameLiteral) =>
    withClass(tag, '', literalArgs)

type MakeComponent = typeof makeComponent

type ClassNameBase = MakeComponent & {
  [key in typeof allElements[number]]: ReturnType<MakeComponent>
}

const classNameBase = makeComponent as ClassNameBase
allElements.forEach(tag => (classNameBase[tag] = makeComponent(tag)))

const div = classNameBase.div

export default classNameBase
