
export const initial_state = { connected: false }

export async function new_message_action(dispatch, queryClient, message) {
    console.warn("UNHANDLED MQTT>", message)
    // TODO: Overload here
}

export const state_reducer = (currentState, action) => {
    switch (action.type) {
        case 'MQTT_STATUS':
            return {
                ...currentState,
                connected: action.connected
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};