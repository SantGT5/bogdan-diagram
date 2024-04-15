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

function App() {
  const [label, setLabel] = useState<string>("");
  const [parentId, setParentId] = useState<string>();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodesTypes = (label: string) => {
    return {
      group: {
        id: uuidv4(),
        data: { label },
        position: { x: 100, y: 100 },
        className: "light",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          width: 200,
          height: 200,
          zIndex: 1,
        },
        type: "group",
      },
      panel: {
        id: uuidv4(),
        data: { label },
        position: { x: 100, y: 100 },
        className: "light",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          width: 300,
          height: 300,
          zIndex: 0,
        },
        type: "default",
      },
      nodeInput: {
        id: uuidv4(),
        type: "input",
        data: { label },
        style: {
          zIndex: 2,
        },
        className: "light",
        extent: parentId ? ("parent" as const) : undefined,
        position: { x: 100, y: 100 },
        parentId,
      },
      node: {
        id: uuidv4(),
        data: { label },
        style: {
          zIndex: 2,
        },
        className: "light",
        extent: parentId ? ("parent" as const) : undefined,
        position: { x: 100, y: 100 },
        parentId,
      },
    };
  };

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ParentOptions = (node: any) => {

    if (!['group', 'default'].includes(node.type)) {
      return
    }

    return (
      <option key={node.id} value={node.id}>
        {node.data.label}
      </option>
    );
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
            onClick={() => setNodes((cur) => [nodesTypes(label).node, ...cur])}
          >
            Node
          </button>

          <button
            onClick={() =>
              setNodes((cur) => [nodesTypes(label).nodeInput, ...cur])
            }
          >
            nodeInput
          </button>

          <button
            onClick={() => setNodes((cur) => [nodesTypes(label).panel, ...cur])}
          >
            Panel
          </button>

          <button
            onClick={() => setNodes((cur) => [nodesTypes(label).group, ...cur])}
          >
            Group
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
