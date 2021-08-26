// @ts-nocheck
import { config } from 'dotenv';
import { gql, GraphQLClient, } from 'graphql-request';
config();
const endpoint = "https://graphql.anilist.co";
import { settings }  from '../../../../setup/windows/model/token.json'
const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: `Bearer ${settings.token}`,
    },
});
const mutation = gql `
  mutation Mutation(
    $saveMediaListEntryId: Int
    $saveMediaListEntryMediaId: Int
    $saveMediaListEntryStatus: MediaListStatus
  ) {
    SaveMediaListEntry(
      id: $saveMediaListEntryId
      mediaId: $saveMediaListEntryMediaId
      status: $saveMediaListEntryStatus
    ) {
      id
      progress
      status
    }
  }
`;
const variables = {
    saveMediaListEntryId: 114065,
    saveMediaListEntryMediaId: 1,
    saveMediaListEntryStatus: "COMPLETED",
};
const data = await graphQLClient
    .request(mutation, variables)
    //@ts-ignore
    .then((data) => console.log(data))
    //@ts-ignore
    .catch((e) => console.log(e.response.errors[0].validation));
console.log(data);
