import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import nodesReducer, { checkNodeBlocks, checkNodeStatus, NodesState } from "../reducers/nodes";
import { mockBlocksTest, mockBlocksTest2, mockBlocksTest3 } from '../utils/mockBlocksTests'

describe("Store", () => {
  const nodes = {
    list: [
      { url: "a.com", online: false, name: "", loading: false, blocks: [] },
      { url: "b.com", online: false, name: "", loading: false, blocks: [] },
      { url: "c.com", online: false, name: "", loading: false, blocks: [] },
      { url: "d.com", online: false, name: "", loading: false, blocks: [] },
    ],
  };

  let store: EnhancedStore<
    { nodes: NodesState },
    AnyAction,
    [
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, null>
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, undefined>
    ]
  >;

  beforeAll(() => {
    store = configureStore({
      reducer: {
        nodes: nodesReducer,
      },
      preloadedState: { nodes },
    });
  });
  afterAll(() => { });

  it("should display results when necessary data is provided", () => {
    const actions = [
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "alpha" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "beta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "gamma" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[2] },
        payload: { node_name: "delta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "epsilon" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "zeta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "eta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "theta" },
      },
    ];
    actions.forEach((action) => store.dispatch(action));

    const actual = store.getState();
    const expected = {
      list: [
        { url: "a.com", online: true, name: "theta", loading: false, blocks: [] },
        { url: "b.com", online: true, name: "epsilon", loading: false, blocks: [] },
        { url: "c.com", online: true, name: "delta", loading: false, blocks: [] },
        { url: "d.com", online: false, name: "", loading: false, blocks: [] },
      ],
    };

    expect(actual.nodes).toEqual(expected);
  });

  it("should display results when necessary data about blocks is provided", () => {
    const actions = [
      {
        type: checkNodeBlocks.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { data: mockBlocksTest2 },
      },
      {
        type: checkNodeBlocks.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { data: mockBlocksTest2 },
      },
      {
        type: checkNodeBlocks.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { data: mockBlocksTest3 },
      },
      {
        type: checkNodeBlocks.fulfilled.type,
        meta: { arg: nodes.list[2] },
        payload: { data: mockBlocksTest3 },
      },
      {
        type: checkNodeBlocks.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { data: mockBlocksTest },
      },
    ];
    actions.forEach((action) => store.dispatch(action));

    const actual = store.getState();
    const expected = {
      list: [
        { url: "a.com", online: true, name: "theta", loading: false, blocks: mockBlocksTest },
        { url: "b.com", online: true, name: "epsilon", loading: false, blocks: mockBlocksTest2 },
        { url: "c.com", online: true, name: "delta", loading: false, blocks: mockBlocksTest3 },
        { url: "d.com", online: false, name: "", loading: false, blocks: [] },
      ],
    };

    expect(actual.nodes).toEqual(expected);
  });
});
