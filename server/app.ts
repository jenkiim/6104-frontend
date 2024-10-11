import AuthenticatingConcept from "./concepts/authenticating";
import FriendingConcept from "./concepts/friending";
import LabelingConcept from "./concepts/labeling";
import RespondingConcept from "./concepts/responding";
import SessioningConcept from "./concepts/sessioning";
import SideingConcept from "./concepts/sideing";
import TopicingConcept from "./concepts/topicing";
import UpvotingConcept from "./concepts/upvoting";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Topicing = new TopicingConcept("topics");
export const RespondingToTopic = new RespondingConcept("responsesToTopics");
export const RespondingToResponse = new RespondingConcept("responsesToResponses");
export const Sideing = new SideingConcept("sides");
export const TopicLabeling = new LabelingConcept("topicLabels");
export const ResponseLabeling = new LabelingConcept("responseLabels");
export const Upvoting = new UpvotingConcept("upvotes");
export const Friending = new FriendingConcept("friends");
