import './App.css'
import PostsTable from './postsTable'
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostsTable />
    </QueryClientProvider>
  );
}

export default App;

