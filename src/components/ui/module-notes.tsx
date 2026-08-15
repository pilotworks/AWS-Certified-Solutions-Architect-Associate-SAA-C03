import React, { useState, useEffect } from "react";
import {
  IconDeviceFloppy,
  IconCheck,
  IconEdit,
  IconEye,
  IconFileText,
  IconBookmarkPlus,
} from "@tabler/icons-react";
import { Button } from "./button";
import { MarkdownRenderer } from "../markdown/markdown-renderer";

interface ModuleNotesProps {
  moduleId: string;
  moduleTitle: string;
  savedNote?: string;
  onSaveNote: (moduleId: string, note: string) => void;
}

export const ModuleNotes: React.FC<ModuleNotesProps> = ({
  moduleId,
  moduleTitle,
  savedNote = "",
  onSaveNote,
}) => {
  const [note, setNote] = useState<string>(savedNote);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setNote(savedNote || "");
  }, [savedNote, moduleId]);

  const handleSave = () => {
    onSaveNote(moduleId, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleInsertTemplate = () => {
    const template = `### 📝 IconKey Memorization Points for ${moduleTitle}
- **Crucial Exam Rule**: 
- **Cost Factor**: 
- **Gotchas / Anti-patterns**: 

### 🎯 High-frequency Exam Scenarios
1. *Scenario*: 
   *Solution*: 
`;
    setNote((prev) => (prev ? `${prev}\n\n${template}` : template));
  };

  return (
    <div
      className="rounded-2xl border p-6 space-y-4 shadow-sm transition-colors"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Header Toolbar */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div>
          <h3
            className="text-base font-bold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <IconFileText
              className="w-4 h-4"
              style={{ color: "var(--text-accent)" }}
            />
            <span>Personal Study Notes & Cheat Sheet</span>
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Auto-saved locally in browser for{" "}
            <span style={{ color: "var(--text-primary)" }}>{moduleTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInsertTemplate}
            title="Insert study template"
            className="text-xs border"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <IconBookmarkPlus className="w-3.5 h-3.5 mr-1" />
            Template
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs border"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {isPreview ? (
              <>
                <IconEdit className="w-3.5 h-3.5 mr-1 text-sky-500" />
                Editor
              </>
            ) : (
              <>
                <IconEye className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Preview
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            {isSaved ? (
              <IconCheck className="w-3.5 h-3.5" />
            ) : (
              <IconDeviceFloppy className="w-3.5 h-3.5" />
            )}
            <span>{isSaved ? "Saved!" : "Note"}</span>
          </Button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      {isPreview ? (
        <div
          className="min-h-[260px] p-5 rounded-xl border overflow-y-auto"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          {note.trim() ? (
            <MarkdownRenderer content={note} />
          ) : (
            <p
              className="text-xs italic"
              style={{ color: "var(--text-muted)" }}
            >
              No notes written yet. Switch to Editor to jot down your key exam
              takeaways.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Write your personal takeaways, memory tips, or exam traps for ${moduleTitle} (Markdown supported)...`}
            rows={10}
            className="w-full p-4 rounded-xl text-base md:text-xs font-mono transition-colors resize-y leading-relaxed outline-none border focus:ring-1"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
          <div
            className="flex items-center justify-between text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            <span>
              Supports standard Markdown formatting (lists, bold, code blocks)
            </span>
            <span>{note.length} characters</span>
          </div>
        </div>
      )}
    </div>
  );
};
