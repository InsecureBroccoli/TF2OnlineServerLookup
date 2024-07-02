import {useState} from 'react'
import {Button, CircularProgress, TextField} from "@mui/material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function App() {
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState("")
    const [serverData, setServerData] = useState(null)

    const getServerInfo = async () => {
        setLoading(true)
        fetch(`${BACKEND_URL}/getserverinfo?address=${address}`)
            .then((response) => response.json())
            .then((data) => setServerData(data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <TextField label="IP Address" value={address} onChange={(event) => {
                setAddress(event.target.value)
            }}/>
            <Button variant="contained" onClick={getServerInfo}>Submit</Button>
            {loading && <CircularProgress/>}
            {serverData && <pre>{JSON.stringify(serverData, null, 2)}</pre>}
        </>
    )
}

export default App
