import { useEffect, useState } from "react"
import { get } from "../lib/api"



export function useCoordinates(query, token) {
    const [state, setState] = useState({
        loading: false,
        coordinates: [],
        error: null
    })
    let controller = null
    useEffect(() => {
        let _mounted = true
        if(controller) {
            controller.abort()
        }
        controller = new AbortController()
        if(query === '') {
            return
        }
        setState({
            ...state,
            loading: true
        })

        let promise = null
        try {
            const url = new URL(query)
            promise = get('/misc/get_coordinates', {url: query}, { signal: controller.signal })
        } catch(e) {
            promise = get('/misc/search_places', {query: query, token: token}, { signal: controller.signal })
        }
        promise.then(
            data => {
                setState({
                    loading: false,
                    coordinates: data,
                    error: null
                })
            }
        ).catch(e => {
            setState({
                ...state,
                loading: false,
                error: e
            })
        })
        return () => _mounted = false
    }, [query])
    return state
}

export function useOptions() {
    const [state, setState] = useState({
        loading: false,
        options: [],
        error: null
    })
    useEffect(() => {
        let _mounted = true
        setState({
            ...state,
            loading: true
        })

        get('/misc/options', {}).then(
            data => {
                setState({
                    loading: false,
                    options: data,
                    error: null
                })
            }
        ).catch(e => {
            setState({
                ...state,
                loading: false,
                error: null
            })
        })
        return () => _mounted = false
    }, [])
    return state
}