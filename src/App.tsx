import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Edge,
  Connection,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import { v4 as uuidv4 } from "uuid";

const initialNodePosition = { x: 100, y: 100 };

const nodeOptions = {
  group: {
    style: {
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      width: 200,
      height: 200,
      zIndex: 1,
    },
  },
  panel: {
    style: {
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      width: 300,
      height: 300,
      zIndex: 0,
    },
  },
  node: {
    style: {
      zIndex: 2,
    },
  },
};

function App() {
  const [label, setLabel] = useState<string>("");

  const [parentId, setParentId] = useState<string>();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const createNode = (type: string, password?: string, option = {}) => {
    const newNode = {
      id: uuidv4(),
      data: { label, password },
      position: initialNodePosition,
      className: "light",
      extent: parentId ? ("parent" as const) : undefined,
      parentId,
      type,
      ...option,
    };

    setNodes((cur) => [...cur, newNode]);
  };

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ParentOptions = (node: any) => {
    if (!["group", "default"].includes(node.type)) {
      return;
    }

    return (
      <option key={node.id} value={node.id}>
        {node.data.label}
      </option>
    );
  };

  const passwordRequest = () => {
    const password = prompt("Please password:");

    if (password == null || password == "") {
      alert("Error: password not provided.");
      return null;
    }

    return password;
  };

  const hasPermissionToCreateNode = () => {
    let password;

    if (parentId) {
      const requestedPass = passwordRequest();

      password = nodes.find((node) => node.id === parentId)?.data
        .password as string;

      if (password !== requestedPass) {
        alert("Wrong password");
        return false;
      }
    }

    return true;
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="react-flow-subflows-example"
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />

        <Panel style={{ gap: "10px", display: "flex" }} position="top-right">
          <select onChange={(e) => setParentId(e.currentTarget.value)}>
            <option value="">--Please choose an option--</option>
            {nodes.map((node) => ParentOptions(node))}
          </select>

          <input
            type="text"
            placeholder="Label"
            onChange={(e) => setLabel(e.currentTarget.value)}
          />

          <button
            onClick={() =>
              hasPermissionToCreateNode() &&
              createNode("", undefined, nodeOptions.node)
            }
          >
            Node
          </button>

          <button
            onClick={() => hasPermissionToCreateNode() && createNode("input")}
          >
            nodeInput
          </button>

          <button
            onClick={() => {
              const password = passwordRequest();
              password && createNode("default", password, nodeOptions.panel);
            }}
          >
            Panel
          </button>

          <button
            onClick={() => {
              const password = passwordRequest();
              password && createNode("group", password, nodeOptions.group);
            }}
          >
            Group
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
