import React from "react";
import { GraduationCap } from "lucide-react";

function SIA() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8000FF", // purple
        borderRadius: "50%",
        width: "61px",
        height: "61px",
      }}
    >
      <GraduationCap color="white" size={32} strokeWidth={2} />
    </div>
  );
}

export default SIA;