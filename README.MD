# Shoestring React User Interface Service Module
## Description
The service module provides a framework for serving a react app to provide a user interface. It includes functionality for receiving and sending MQTT events.

## Usage
This service module is designed to be deployed using the Shoestring Assembler.

To integrate in a solution (for context refer to [the Assembler Solution File Structure](https://github.com/DigitalShoestringSolutions/shoestring_assembler/blob/main/docs/file_structure.md)):

### Source config
* At `solution_config/source_config/<source_name>/src` put the react source code for your pages
* At `solution_config/source_config/<source_name>/config/` put any config files. An `mqtt_config.json` file is required which contains the mqtt connection details - format below.
* At `solution_config/source_config/<source_name>/overload/` there are three files `routing.jsx`, `contexts.jsx` and `handle_mqtt.jsx`.

#### Importing
The base image adds some import scopes.
The elements of the base service module can be referenced with the prefix `core`. (This means that the mqtt context can be referenced at `core/context/mqtt` and the toast context at `core/context/toast`). The `src` contents can be accessed at the `app` prefix. (this can be seen in the `routing.jsx` example below)

#### Routing

In `routing.jsx` there needs to be a `Routing()` function exported which defines the `react-router-dom` routes.

**example routing.jsx**
```
import {Page1} from 'app/page1'
import {Page2} from 'app/page2'

export function Routing() {
  return (
    <Routes>
      <Route path='/' element={<Base />}>
        <Route path='/page1' element={<Page1 />} />
        <Route path='/page2' element={<Page2 />} />
      </Route>
    </Routes>
  )
}

// route sub elements get rendered in the Outlet
function Base() {
    return <div>
        <Header/>
        <div>
            <Outlet />
        </div>
        <Footer/>
    </div>
}
```

#### Context

`contexts.jsx` is optional. It can be used to add any contexts before the routing section. Inside there needs to be a `ExtraPreRoutingContexts()` function exported which wraps `children` and adds any extras context providers.

**Example from location tracking dashboard**
```
export function ExtraPreRoutingContexts({ children }) {
    let { data: config, isLoading, error } = useConfig()

    if (isLoading)
        return "Loading..."
    
    return <FilterProvider config={config}>
        {children}
    </FilterProvider>
}
```

#### MQTT 

**mqtt_config.json**
```
{
    "host": "",
    "port": 9001,
    "prefix": [],
    "subscriptions":["location_state/#"]
}
```
| entry | description |
|---|---|
|host|IP address or hostname of the broker - leave blank if the same IP/hostname as the user interface|
|port|MQTT port - typically 9001|
|prefix|Prefix to add to any published messages - array of strings which will be joined by `/` (`["a","b"]` will turn into `a/b`)|
|subscriptions| A list of topics to subscribe to|

**Sending messages**
```
import {useMQTTControl} from 'core/context/mqtt'

... // in a react component function
let = {sendJsonMessage} = useMQTTControl()

let topic = "your/topic/here"
let payload = {
    "json":"payload"
}
sendJsonMessage(topic, payload)

// with qos
qos = 1
sendJsonMessage(topic, payload,qos)

// as retained message
retained = True
sendJsonMessage(topic, payload,qos,retained)
...
```

**Dynamic Subscriptions**


To dynamically subscribe to topics as required you can do so as follows:

```
import {useMQTTControl} from 'core/context/mqtt'

... // in a react component function
let = {subscribe,unsubscribe} = useMQTTControl()

// this will subscribe on component mount and unsub on unmount
React.useEffect({
    subscribe("your/topic")
    return () => {
        unsubscribe("your/topic")
    }
},[])
...
```

**handle_mqtt.jsx**

This is where the mqtt message handling is done.

**base template**
```
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
```