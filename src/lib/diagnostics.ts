export const DIAGNOSTIC_CUSTOMER_NAME = "TEST — admin diagnostics"

export function diagnosticCleanupQueries() {
  return [
    { text: `DELETE FROM content_records target USING content_records marker
      WHERE marker.record_type = 'diagnostic_records'
        AND target.record_type = marker.data->>'type' AND target.record_key = marker.data->>'id'
        AND (target.data->>'customerName' = $1 OR target.data->>'name' = $1)
      RETURNING target.record_key`, values: [DIAGNOSTIC_CUSTOMER_NAME] },
    { text: "DELETE FROM content_records WHERE record_type = 'diagnostic_records'", values: [] },
  ]
}
