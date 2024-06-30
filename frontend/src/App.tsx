import {useState} from 'react'
import {Button, CircularProgress, TextField} from "@mui/material";

const BACKEND_URL = ""

function App() {
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState("")

    const getServerInfo = async () => {
        setLoading(true)
        try {
            await fetch(BACKEND_URL)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TextField label="IP Address" value={address} onChange={(event) => {
                setAddress(event.target.value)
            }}/>
            <Button variant="contained" onClick={getServerInfo}>Submit</Button>
            {loading && <CircularProgress/>}
        </>
    )
}

export default App
