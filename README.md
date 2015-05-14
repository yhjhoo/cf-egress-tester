# cf-egress-tester
A quick app to test network egress from a CF space.

This app is intended for testing [application security group](http://docs.pivotal.io/pivotalcf/adminguide/app-sec-groups.html) rules in Cloud Foundry. Once deployed to CF, it provides a quick check of network egress from the running application (e.g. from within a CF space).  It provides a UI form for testing connectivity to a specific host:port, and an HTTP endpoint at `GET /egress-status/tcp|udp/{host}/{port}`.

## Running locally
1.  Clone this repo.
2.  Download dependencies with `bundle install`.
3.  Run the app at http://localhost:9292/

## Testing on Cloud Foundry
Assuming you have a local CF instance on bosh-lite:

1. Deploy the app with `cf push egress-test`.
2. Navigate to the app's route, fill out the form for `google.com:80`, verify connectivity.
3. Remove outbound access to public networks.
  1. `cf unbind-running-security-group public_networks`
  2. `cf restart egress-test`
  3. From the app, again fill out the form for `google.com:80`, this time verifying that the connection is refused.

To restore connectivity for a specific destination, such as google.com, add a security group opening only that egress.

1. `nslookup google.com`
2.  Take one of the resolved IP addresses (e.g. `216.58.216.78`, though there are many) and enter it into a security group definition such as

  ``` sh
  cat << EOF > asg_google-public-http.json
  [
  	{
      "protocol": "tcp",
      "destination": "216.58.216.78",
      "ports": "80"
  	}
  ]
  EOF
  ```

3. Apply the security group

  ``` sh
  > cf create-security-group google asg_google-public-http.json
  > cf bind-security-group google me development
  > cf restart egress-test
  ```

4. Navigate to the app again and verify connectivity to that IP (e.g. `216.58.216.78:80`).
