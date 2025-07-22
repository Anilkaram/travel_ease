# feature 2
<img width="1920" height="1080" alt="Screenshot (261)" src="https://github.com/user-attachments/assets/a8370a95-59dd-4df6-ac3f-5a73776937c8" />

# feature 3
<img width="1920" height="1080" alt="Screenshot (278)" src="https://github.com/user-attachments/assets/2ec67c28-acc9-4adf-aeb6-9062dcb56efa" />

# upgrading application with new version using canary deployment strategy
 ### Phase 1: Preparation and Canary Creation

  1. Initial Assessment: We started by verifying the status of your existing
  travel-client  and  travel-server  deployments in the  dev  namespace.
  2. Create Canary Deployments:
    • We created two new "canary" deployments:  travel-client-canary  and
    travel-server-canary .
    • These were configured with the new V4 container images (
    anildoc143/travel_ease_website_v4:client  and  ...:server ).
    • Crucially, we added the label  track: canary  to these deployments and
    their pods. This allowed us to target them separately from the stable
    versions.


  ### Phase 2: Traffic Splitting Setup

  3. Create Canary Services: To route traffic to the new canary pods, we
  created two new services:  travel-client-canary-service  and  travel-server-
  canary-service . Their selectors were configured to match the  track: canary
  label.
  4. Implement Canary Ingress Rule:
    • We created a new Ingress resource named  travel-ingress-canary .
    • Using NGINX Ingress annotations, we configured it to act as a canary:
      •  nginx.ingress.kubernetes.io/canary: "true"
      •  nginx.ingress.kubernetes.io/canary-weight: "25"
    • This directed 25% of user traffic to the  travel-client-canary-service ,
    effectively sending a quarter of your users to the new V4 application.


  ### Phase 3: Gradual Traffic Increase

  5. Monitor and Increase Traffic: After confirming the initial canary was
  stable, you asked to increase its exposure. We patched the  travel-ingress-
  canary  to update the weight to 50%, splitting traffic evenly between the
  old and new versions.

  to increase weight :
  kubectl patch ingress travel-ingress-canary -n dev --patch '{"metadata":{"annotations":{"nginx.ingress.kubernetes.io/canary-weight":"50"}}}'

  ### Phase 4: Full Production Rollout

  6. Update Main Deployments: Once you were confident in the new version's
  performance, we initiated the full rollout by updating the stable
  deployments directly with the new V4 images using the  kubectl set image
  command.
  7. Monitor the Rollout: We watched as the main  travel-client  and  travel-
  server  deployments performed a rolling update, replacing the old V2/V3 pods
  with new V4 pods until they were 100% updated.

  ### Phase 5: Cleanup

  8. Remove Canary Resources: With the new version live in the main
  deployments, we cleaned up the temporary canary environment by deleting:
    • The  travel-ingress-canary  Ingress.
    • The  travel-client-canary-service  and  travel-server-canary-service .
    • The  travel-client-canary  and  travel-server-canary  deployments.


  This methodical process allowed you to safely test your new application
  version with a subset of users before rolling it out to everyone, minimizing
  risk and ensuring a smooth transition.

# grafana dashboard 
<img width="1920" height="1080" alt="Screenshot (275)" src="https://github.com/user-attachments/assets/103624b3-00c4-40e5-aecd-f20a535bb79d" />

# kubectl-ai (fix issues in k8s cluster) 
<img width="1920" height="1080" alt="Screenshot (273)" src="https://github.com/user-attachments/assets/890722a0-57fa-4a1b-bfa7-36eaee9489a9" />

# cluster 
<img width="668" height="169" alt="image" src="https://github.com/user-attachments/assets/5ef979c7-1087-412f-a659-b8b71ca093e5" />
<img width="1920" height="1080" alt="Screenshot (265)" src="https://github.com/user-attachments/assets/24b68748-a3e0-442f-82a1-46014361bffb" />
