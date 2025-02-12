import type React from "react";

import "./Loader.scss";

interface LoaderProps {
  isLoading: boolean;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, color = "#003366" }) => {
  const letters = "ZOMMA".split("");

  return (
    <div className={`zomma-loader ${isLoading ? "visible" : ""}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="zomma-letter"
          style={{
            animationDelay: `${index * 0.1}s`,
            color: color,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default Loader;
