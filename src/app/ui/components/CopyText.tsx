import { useState } from "react";
import { Copy } from "lucide-react";

const CopyableText = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center p-2 rounded-md max-w-[40px]">
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-gray-200 rounded transition"
        title="Copy"
      >
        <Copy size={16} />
      </button>
      {copied && <span className="text-xs text-black-600 pl-1">Copied!</span>}
    </div>
  );
};

export default CopyableText;