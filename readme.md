# ⚠️ WIP, unstable, dirty, move along.

This was written in a few hours after I wished for this to exist. A quick google
search revealed some small similar projects, but I felt like this was a good
exercise in JavaScript/TypeScript.

It's working fine, but there's still a lot to be done on the typing side, that's
why there's no install guide. After finishing a few client projects with this,
I might polish it sufficiently for others to use.

---

# className-Components

Create primitive react components using classnames with the
styled-components-like API we all know and love.

## Contrived example:

```jsx
import cn from "classname-components";

const Box = cn.div`border p-8`
const OtherBox = cn(Box)`bg-teal-200`
const Button = cn.button`p-4 shadow-md hover:bg-black hover:text-white border`
const PropBox = cn(OtherBox)`
  ${(props) => props?.active ? 'ring-4 ring-yellow shadow-xl' : 'shadow-md'}
`

function SomeComponent() {
  return (
    <>
      <Box>I'm a Box</Box>
      <OtherBox as="p">I'm another box</Box>
      <Button onClick={() => alert('whoop')}>And I'm a button</Button>
      <OtherBox as={AnotherComponent}>This is working too!</OtherBox>
    </>
  );
}

export function AnotherComponent({children}) {
  return <div>Hello!: {children}</div>
}
```
