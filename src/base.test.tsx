import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ReactNode} from 'react'
import cn, { withClass } from './base'

/**
 * TODO: change the order and rewrite descriptions to be documentation
 * TODO: add `.attr` method to add attributes to component
 * TODO: via injecting output result (via screen?)
 * TODO: dedupe classNames on demand
 * TODO: generate displayName
 * TODO: create demo sandbox
 * TODO: create github-page
 */
describe('classname-components', () => {
  test('withClass creates a component with className set that renders children', () => {
    const ClassNameComponent = withClass('div', 'foo bar')
    const { container } = render(<ClassNameComponent>hello</ClassNameComponent>)
    expect(ClassNameComponent?.attrs?.className).toBe('foo bar')
    expect(container.firstChild).toHaveClass('foo bar')
    expect(container.textContent).toEqual('hello')
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  test('ClassNameComponents behave just like normal components', () => {
    const ClassNameComponent = withClass('button', 'foo bar')
    const spy = jest.fn()
    render(<ClassNameComponent onClick={spy}>hello</ClassNameComponent>)
    userEvent.click(screen.getByText('hello'))
    expect(spy).toHaveBeenCalled()
  })

  test('withClass can take a ClassNameComponent and extend its classNames', () => {
    const ClassNameComponent = withClass('div', 'foo bar')
    const ClassierComponent = withClass(ClassNameComponent, 'baz')
    const { container } = render(<ClassierComponent />)
    expect(container.firstChild).toHaveClass('foo bar baz')
  })

  test('cn.div`foo bar` creates a component with className', () => {
    const ClassNameComponent = cn.div`foo bar`
    const { container } = render(<ClassNameComponent />)
    expect(container.firstChild).toHaveClass('foo bar')
  })

  test('can take a classname-component', () => {
    const ClassNameComponent = cn.div`foo bar`
    const ClassierComponent = cn(ClassNameComponent)`baz`
    const { container } = render(<ClassierComponent />)
    expect(container.firstChild).toHaveClass('foo bar baz')
  })

  test('changing the tagName if `as` was used', () => {
    const ClassNameComponent = withClass('div', 'foo bar')
    const { container } = render(
      <ClassNameComponent as="p">hello</ClassNameComponent>
    )
    expect(container.firstElementChild?.tagName).toBe('P')
  })

  test('composition works as expect', () => {
    const Box = cn.div`box`
    const Link = cn.a`hover:underline`
    const Span = ({children}:{children: ReactNode}) => <span>{children}</span>
    const { container, debug } = render(
      <Box>
        <Link>A Link</Link>
        <Link>Another Link</Link>
        <Box>
          <Link>A wrapped <Span>Link</Span></Link>
        </Box>
      </Box>
    )

   expect (container.textContent).toBe("A LinkAnother LinkA wrapped Link")
  });

  test('as can also take a normal component', () => {
    const ClassNameComponent = withClass('div', 'foo bar')
    const SomeComponent: React.FC = ({ children }) => {
      return <div>Foobar! {children}</div>
    }
    const { container } = render(
      <ClassNameComponent as={SomeComponent}>hello</ClassNameComponent>
    )
    expect(container.firstChild?.textContent).toContain('Foobar! hello')
  })

  it('handles simple expressions in literal', () => {
    const ClassNameComponent = cn.div`foo bar ${'baz'}`
    const { container } = render(<ClassNameComponent>hello</ClassNameComponent>)
    expect(container.firstChild).toHaveClass('foo bar baz')
  })

  it('passes props to function expressions in literal', () => {
    type ExampleComponentProps = {
      baz?: boolean
    }
    const ExampleComponent = cn.div`foo bar ${(props: ExampleComponentProps) =>
      props?.baz ? 'baz' : 'nobaz'} `
    const { container } = render(<ExampleComponent baz>hello</ExampleComponent>)
    expect(container.firstChild).toHaveClass('foo bar baz')
  })

  it('has a workaround for attributes until implemented', () => {
    const ExampleComponent = cn.input`foo bar`
    const { container } = render(<ExampleComponent type="password" />)
    expect(container.firstChild).toHaveAttribute('type')
    expect(container.firstElementChild?.getAttribute('type')).toBe('password')
  })

  it.todo('can receive arbitrary attributes')
  it.todo('dedupes duplicates on desired')
})
