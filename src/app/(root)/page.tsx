import { UserButton } from "@clerk/nextjs"

const rootpage = () => {
  return (
    <div>
      Root page
      <UserButton/>
    </div>
  )
}

export default rootpage
