import { useState } from 'react'
import {Button, TextField} from "@mui/material";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <TextField label="IP Address"/>
        <Button variant="contained">Submit</Button>
    </>
  )
}

export default App
