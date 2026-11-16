/* Lader gebaseerd op Uiverse.io (dovatgabriel), in Appmaatje-groen */
export const Loader = ({ size = 22, color = "#25855A", label = "Bezig…" }: { size?: number; color?: string; label?: string }) => (
  <span role="status" aria-label={label} className="three-body" style={{ ["--uib-size" as string]: `${size}px`, ["--uib-color" as string]: color }}>
    <span className="three-body__dot" /><span className="three-body__dot" /><span className="three-body__dot" />
  </span>
);
