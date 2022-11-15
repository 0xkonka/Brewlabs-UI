import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { gql, request } from "graphql-request";

const pageSize = 1000;

const requestsUserQuery = gql`
  query getRequests($user: String!, $first: Int!, $skip: Int!) {
    requests: userRequests(
      where: { user: $user }
      orderBy: txHash
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      user: recipient
      txHash
      messageId
      timestamp
      amount
      token
      decimals
      symbol
      message {
        txHash
        messageId: msgId
        messageData: msgData
        signatures
      }
    }
  }
`;

const requestsRecipientQuery = gql`
  query getRequests($user: String!, $first: Int!, $skip: Int!) {
    requests: userRequests(
      where: { user_not: $user, recipient: $user }
      orderBy: txHash
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      user: recipient
      txHash
      messageId
      timestamp
      amount
      token
      decimals
      symbol
      message {
        txHash
        messageId: msgId
        messageData: msgData
        signatures
      }
    }
  }
`;

const executionsQuery = gql`
  query getExecutions($first: Int!, $skip: Int!, $messageIds: [Bytes!]) {
    executions(
      where: { messageId_in: $messageIds }
      first: $first
      skip: $skip
      orderBy: txHash
      orderDirection: desc
    ) {
      txHash
      messageId
      token
      status
    }
  }
`;

export const getExecutions = async (graphEndpoint: string, requests: any[]) => {
  const messageIds = requests.map((r) => r.messageId);
  let executions: any[] = [];
  let page = 0;
  const first = pageSize;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const data = await request(graphEndpoint, executionsQuery, {
        first,
        skip: page * pageSize,
        messageIds,
      });
      if (data) {
        executions = data.executions.concat(executions);
      }
      if (!data || data.executions.length < pageSize) break;
      page += 1;
    } catch (graphExecutionsError) {
      console.error({ graphExecutionsError });
      break;
    }
  }

  return { executions };
};

const getRequestsWithQuery = async (user: string, graphEndpoint: string, query: any) => {
  let requests: any[] = [];
  let page = 0;
  const first = pageSize;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const data = await request(graphEndpoint, query, {
        user,
        first,
        skip: page * pageSize,
      });
      if (data) {
        requests = data.requests.concat(requests);
      }
      if (!data || data.requests.length < pageSize) break;
      page += 1;
    } catch (graphUserRequestsError) {
      console.error({ graphUserRequestsError });
      break;
    }
  }

  return { requests };
};

export const getRequests = async (user: string, graphEndpoint: string) => {
  const [userRequests, recipientRequests] = await Promise.all([
    getRequestsWithQuery(user, graphEndpoint, requestsUserQuery),
    getRequestsWithQuery(user, graphEndpoint, requestsRecipientQuery),
  ]);
  return {
    requests: [...userRequests.requests, ...recipientRequests.requests],
  };
};

export const combineRequestsWithExecutions = (
  requests: any[],
  executions: any[],
  chainId: ChainId,
  bridgeChainId: ChainId
) =>
  requests.map((req) => {
    const execution = executions.find(
      (exec) => exec.messageId === req.messageId
    );
    return {
      user: req.user,
      chainId,
      timestamp: req.timestamp,
      sendingTx: req.txHash,
      receivingTx: execution?.txHash,
      status: execution?.status,
      amount: req.amount,
      fromToken: {
        address: req.token,
        decimals: req.decimals,
        symbol: req.symbol,
        chainId,
      },
      toToken: {
        address: execution ? execution.token : ethers.constants.AddressZero,
        decimals: req.decimals,
        symbol: req.symbol,
        chainId: bridgeChainId,
      },
      message: req.message,
    };
  });
