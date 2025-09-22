import { useQuery } from "@tanstack/react-query"
import APIBackend from 'core/RestAPI'


export function useMQTTConfig() {
    return useQuery(
        {
            queryKey: ['mqtt_config'],
            queryFn: async () => APIBackend.api_get('http://' + document.location.host + '/config/mqtt_config.json'),
            select: (data) => (data.payload)
        }
    )
}


export function useModuleConfig() {
    return useQuery(
        {
            queryKey: ['config'],
            queryFn: async () => APIBackend.api_get('http://' + document.location.host + '/config/config.json'),
            select: (data) => (data.payload)
        }
    )
}

