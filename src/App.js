import { Routing } from "./commons/routes/index";
import MyErrorBoundaryExample from "./ErrorBoundy";
function App() {
  return (
    <MyErrorBoundaryExample>
      <Routing />
    </MyErrorBoundaryExample>
  );
}
export default App;
