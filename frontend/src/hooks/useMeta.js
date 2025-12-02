import { useEffect } from "react";

export default function useMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let desc = document.querySelector("meta[name='description']");
      if (!desc) {
        desc = document.createElement("meta");
        desc.name = "description";
        document.head.appendChild(desc);
      }
      desc.setAttribute("content", description);
    }
  }, [title, description]);
}
