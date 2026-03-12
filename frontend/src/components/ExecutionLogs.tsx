import { useExecutionStore } from "@/store/executionStore";
import { ChevronUp, ChevronDown, Terminal } from "lucide-react";
import { useState } from "react";

const ExecutionLogs = () => {
  const { logs, isRunning, executionId } = useExecutionStore();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`bg-panel border-t border-border transition-all ${expanded ? "h-48" : "h-10"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full h-10 px-4 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Execution Logs</span>
        {isRunning && (
          <span className="ml-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-running animate-pulse" />
            <span className="text-status-running">Running</span>
          </span>
        )}
        {executionId && <span className="ml-2 font-mono text-[10px] text-muted-foreground/60">{executionId}</span>}
        <span className="ml-auto">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </span>
      </button>
      {expanded && (
        <div className="h-[calc(100%-2.5rem)] overflow-y-auto px-4 pb-3 space-y-1 font-mono text-[11px]">
          {logs.length === 0 ? (
            <p className="text-muted-foreground/50 py-2">No logs yet. Execute a workflow to see results.</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground/40 shrink-0">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className={`shrink-0 ${
                  log.status === "SUCCESS" || log.status === "COMPLETED" ? "text-status-success" :
                  log.status === "FAILED" ? "text-status-error" : "text-status-running"
                }`}>
                  [{log.status}]
                </span>
                <span className="text-foreground/80">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionLogs;
