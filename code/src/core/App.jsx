// import css for bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
// set up dayjs
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isToday);

// Set up react-query
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()

// import context providers
import { MQTTProvider } from 'core/context/mqtt'
import { ToastProvider } from 'core/context/toast'
import { BrowserRouter } from 'react-router-dom'


// import overloaded functions
import { Routing } from 'overload/routing';
import { ExtraPreRoutingContexts } from 'overload/contexts';

// import indicators
import { LoadingIndicator, ErrorIndicator } from 'core/indicators';

// api
import { useMQTTConfig } from 'core/api';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  )
}

function AppInner() {
  let { data: config, isLoading, error } = useMQTTConfig()

  if (isLoading)
    return <LoadingIndicator />
  if (error)
    return <ErrorIndicator error={error} />

  return <MQTTProvider
    host={config?.mqtt?.host ? config.mqtt.host : document.location.hostname}
    port={config?.mqtt?.port ?? 9001}
    prefix={config?.mqtt?.prefix ?? []}
    subscriptions={config?.mqtt?.subscriptions ?? []}
    debug={false}
  >
    <ToastProvider position='bottom-end'>
      <ExtraPreRoutingContexts>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </ExtraPreRoutingContexts>
    </ToastProvider>
  </MQTTProvider>
}

export default App;
