
### Issues:

- No way to bulk run jobs.
- Job data is stored in a seperate service (user_and_job_state).
  API-wise, this is complex and are details that likely shouldn't be handeled by the consumer.
- No method to get job status in bulk.

### Needs:

Need an `list_status` method which returns a list of metadata (status) for the last x jobs.

- Should be sorted by time by default.
- Should have option to filter jobs by 'method type', or whatever would allow one to filter by bulk uploads.

