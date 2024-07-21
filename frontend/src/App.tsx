import {useState} from 'react'
import {Button, CircularProgress, TextField} from "@mui/material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function App() {
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState("")
    const [serverData, setServerData] = useState(null)
    const [addressValidationError, setAddressValidationError] = useState(false)

    const getServerInfo = async () => {
        if (!validateAddress(address)) {
            setAddressValidationError(true)
            return
        }

        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/getserverinfo?address=${address}`)
            .then((response) => response.json())
            .then((data) => setServerData(data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false))
    }

    const validateAddress = (address: string): boolean => {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(:([0-9]{1,5}))?$/;
        const domainRegex = /^(?=.{1,253}$)(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

        return ipv4Regex.test(address) || domainRegex.test(address);
    }

    return (
        <>
            <TextField error={addressValidationError}
                       helperText={addressValidationError && "Invalid IP Address"}
                       label="IP Address" value={address}
                       onChange={(event) => {
                setAddress(event.target.value)
                setAddressValidationError(false)
            }}/>
            <Button variant="contained" onClick={getServerInfo}>Submit</Button>
            {loading && <CircularProgress/>}
            {serverData && <pre>{JSON.stringify(serverData, null, 2)}</pre>}
        </>
    )
}

export default App
