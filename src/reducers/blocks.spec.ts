import mockFetch from "cross-fetch";
import reducer, { checkNodeBlocks } from "./nodes";
import { Node } from "../types/Node";
import initialState from "./initialState";
import { mockBlocksTest, mockBlocksTest3 } from "../utils/mockBlocksTests";

jest.mock("cross-fetch");

const mockedFech: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Nodes", () => {
  const getInitialState = () => {
    return initialState().nodes;
  };

  const nodeA: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
    blocks: []
  };

  const nodeB = {
    url: "http://localhost:3003",
    online: false,
    name: "Node 2",
    loading: false,
    blocks: []
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle checkNodeBlocks.pending", () => {
    const appState = {
      list: [nodeA, nodeB],
    };
    const action = { type: checkNodeBlocks.pending, meta: { arg: nodeA } };
    const expected = {
      list: [
        {
          ...nodeA,
          loading: true,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkNodeBlocks.fulfilled", () => {
    const appState = {
      list: [nodeA, nodeB],
    };
    const action = {
      type: checkNodeBlocks.fulfilled,
      meta: { arg: nodeA },
      payload: { data: mockBlocksTest3 },
    };
    const expected = {
      list: [
        {
          ...nodeA,
          online: true,
          blocks: mockBlocksTest3,
          loading: false,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkNodeBlocks.rejected", () => {
    const appState = {
      list: [
        {
          ...nodeA,
          online: true,
          blocks: mockBlocksTest3,
          loading: false,
        },
        nodeB,
      ],
    };
    const action = { type: checkNodeBlocks.rejected, meta: { arg: nodeA } };
    const expected = {
      list: [
        {
          ...nodeA,
          online: false,
          blocks: mockBlocksTest3,
          loading: false,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Actions::Nodes", () => {
  const dispatch = jest.fn();

  afterAll(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });

  const node: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
    blocks: []
  };

  it("should fetch the node blocks", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ data: mockBlocksTest3 });
        },
      })
    );
    await checkNodeBlocks(node)(dispatch, () => { }, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkNodeBlocks.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: checkNodeBlocks.fulfilled.type,
        meta: expect.objectContaining({ arg: node }),
        payload: { data: mockBlocksTest3 },
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch the node blocks", async () => {
    mockedFech.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    await checkNodeBlocks(node)(dispatch, () => { }, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkNodeBlocks.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: checkNodeBlocks.rejected.type,
        meta: expect.objectContaining({ arg: node }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
