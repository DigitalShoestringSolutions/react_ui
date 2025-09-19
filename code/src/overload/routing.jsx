import { Routes, Route } from 'react-router-dom'

// Replace this in your own code and add routing as required
export function Routing() {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<NotReplaced />}></Route>
      </Route>
    </Routes>
  )
}

function NotReplaced({}){
    return "To use this service module base for react you need to have a file at source/overload/routing.jsx that exports a function called Routing"
}
