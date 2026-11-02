type StructuredDataValue = Record<string, unknown>;

/**
 * JSON-LD boundary for verified identity data only. Do not add credentials,
 * profile URLs or claims here until Paul has approved the source details.
 */
export function StructuredData({ data }: { data: StructuredDataValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
