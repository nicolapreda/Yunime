// @ts-nocheck
import { config } from 'dotenv';
import {
  gql,
  GraphQLClient,
} from 'graphql-request';

config();

const endpoint = "https://graphql.anilist.co";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    
    authorization: `Bearer ${process.env.ANILIST_TOKEN}`,
  },
});

const mutation = gql`
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
      status
      progress
    }
  }
`;

const variables = {
  saveMediaListEntryId: "1",
  saveMediaListEntryMediaId: "120697",
  saveMediaListEntryStatus: "COMPLETED",
};

const data = await graphQLClient
  .request(mutation, variables)
  //@ts-ignore
  .then((data) => console.log(data))
  //@ts-ignore
  .catch((e) => console.log(e.response.errors[0].validation));

console.log(data);