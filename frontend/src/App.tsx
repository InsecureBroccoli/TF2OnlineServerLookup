import {useEffect, useState} from 'react'
import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent,
    Snackbar,
    TextField
} from "@mui/material";
import {Favorite, ServerData} from "./types.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function App() {
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState("")
    const [currentAddress, setCurrentAddress] = useState("")
    const [serverData, setServerData] = useState<ServerData | null>(null)
    const [addressValidationError, setAddressValidationError] = useState(false)
    const [requestError, setRequestError] = useState(false)
    const [requestErrorReason, setRequestErrorReason] = useState("")

    const [favorites, setFavorites] = useState<Favorite[]>([])

    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites')
        if (savedFavorites !== null) {
            setFavorites(JSON.parse(savedFavorites))
        }
    }, [])

    const getServerInfo = async () => {
        if (!validateAddress(address)) {
            setAddressValidationError(true)
            return
        }

        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/getserverinfo?address=${address}`)
            .catch((e) => {
                setRequestErrorReason("Unable to connect to backend")
                throw e
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                if (data.error !== undefined) {
                    setRequestErrorReason(data.error)
                    throw new Error(`Received error from backend: ${data.error}`)
                }
                setCurrentAddress(address)
                setServerData(data)
            })
            .catch((e) => {
                setRequestError(true)
                console.error(e)
            })
            .finally(() => setLoading(false))
    }

    const addFavorite = () => {
        if (serverData === null) {
            console.error('tried to add null as favorite')
            return
        }

        const newFavorite: Favorite = {
            name: serverData.name,
            address: currentAddress
        }

        const sameFavoriteIndex = favorites.findIndex((value) => value.address === currentAddress)
        if (sameFavoriteIndex === -1) {
            favorites.push(newFavorite);
        } else {
            favorites[sameFavoriteIndex] = newFavorite;
        }

        localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    const removeFavorite = () => {
        const favoriteIndex = favorites.findIndex((value) => value.address === currentAddress)
        if (favoriteIndex === -1) {
            return;
        }

        favorites.splice(favoriteIndex, 1)

        localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    const validateAddress = (address: string): boolean => {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(:([0-9]{1,5}))?$/;
        const domainRegex = /^(?=.{1,253}$)(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

        return ipv4Regex.test(address) || domainRegex.test(address);
    }

    return (
        <>
            <FormControl>
                <InputLabel>Favorites</InputLabel>
                <Select onChange={(event: SelectChangeEvent) => { setAddress(event.target.value) }}>
                    {favorites.map((favorite) => {
                        return <MenuItem value={favorite.address}>
                            {favorite.name}
                        </MenuItem>
                    })}
                </Select>
            </FormControl>
            <TextField error={addressValidationError}
                       helperText={addressValidationError && "Invalid IP Address"}
                       label="IP Address" value={address}
                       onChange={(event) => {
                setAddress(event.target.value)
                setAddressValidationError(false)
            }}/>
            <Button variant="contained" onClick={getServerInfo}>Submit</Button>
            <Button variant="contained" onClick={addFavorite} disabled={serverData === null}>Add to Favorites</Button>
            <Button variant="outlined" onClick={removeFavorite}>Remove from Favorites</Button>
            {loading && <CircularProgress/>}
            <Snackbar open={requestError} autoHideDuration={5000} onClose={() => {
                setRequestError(false)
                setRequestErrorReason("")
            }}>
                <Alert severity="error">{requestErrorReason}</Alert>
            </Snackbar>
            {serverData && <pre>{JSON.stringify(serverData, null, 2)}</pre>}
        </>
    )
}

export default App
