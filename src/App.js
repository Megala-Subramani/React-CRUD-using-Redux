import './App.css';
import UserDetails from './UserDetails';
import {getUserDetailsFromStore as store} from './Components/store';
import {Provider} from 'react-redux';
import {UserProvider} from './Context'

function App() {
  return (
    <div className="App">
      <UserProvider value={{userState:[],APIcall:false}}>
        <Provider store={store}>
        <UserDetails />
        </Provider>
      </UserProvider>
    </div>
  );
}

export default App;
