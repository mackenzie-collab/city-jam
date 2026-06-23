import BarcodeDivider from "@/components/BarcodeDivider";

interface AffiliateSectionHeaderProps {
  label: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}

export default function AffiliateSectionHeader({
  label,
  title,
  lead,
  align = "left",
}: AffiliateSectionHeaderProps) {
  const centered = align === "center";

  return (
    <header className={centered ? "affiliate-section-header affiliate-section-header--center" : "affiliate-section-header"}>
      <BarcodeDivider className="affiliate-section-header__barcode" />
      <span className="affiliate-badge">{label}</span>
      <h2 className="affiliate-display affiliate-section-title">{title}</h2>
      {lead ? <p className="affiliate-body affiliate-section-lead">{lead}</p> : null}
    </header>
  );
}
