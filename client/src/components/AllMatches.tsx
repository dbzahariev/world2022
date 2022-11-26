import { Space, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import AutoRefresh, { AutoRefreshInterval } from "./AutoRefresh";
import { LoadingOutlined } from "@ant-design/icons";
import OneMatchTable from "./OneMatchTable";

import {
  getAllFinalWinner,
  getAllMatches,
  getPoints,
  stylingTable,
  reloadData,
  getAllUsers,
  MatchType,
  UsersType,
  isGroup,
} from "../helpers/OtherHelpers";
import { showGroupsGlobal, showRound1Global } from "./ModalSettings";

export const getMatchesForView = (
  matches: MatchType[],
  // showGroups: boolean,
  // showRound1: boolean = true
) => {
  let res = [...matches];
  if (showGroupsGlobal === false) {
    res = res.filter((el) => !isGroup(el))
  }
  if (!showRound1Global) {
    res = res.filter((el) => {
      return (el.round !== "ROUND_1")
    })
  }

  return res;
};

export default function AllMatches2({ refresh }: { refresh: Function }) {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);
  // const [showRound1, setShowRound1] = useState(getDefSettings().showRound1);

  let intervalRef = useRef<any>();

  useEffect(() => {
    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        reloadData(setMatches, getAllUsers, (reloadedUsers: UsersType[]) => {
          return setUsers([...reloadedUsers])
        }, users, matches);
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    console.log('refresh from modal')
    if (matches.length > 0) {
      reloadData(setMatches, getAllUsers, (reloadedUsers: UsersType[]) => {
        return setUsers([...reloadedUsers])
      }, users, matches);
    }
    // eslint-disable-next-line
  }, [refresh])

  useEffect(() => {
    if (matches.length === 0) {
      getAllMatches(setMatches);
    }
  }, [matches.length]);

  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  useEffect(() => {
    getAllFinalWinner(users);
    // eslint-disable-next-line
  }, [users]);

  useEffect(() => {
    if (users.length > 0 && matches.length > 0) {
      setLoading(false);
      let res = getPoints(users, matches);
      res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setUsers(res);
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line
  }, [users.length, matches.length]);

  useEffect(() => {
    if (matches.length !== 0 && users.length !== 0) {
      stylingTable(users);
    }
  }, [matches, users])

  console.log("reloading")

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            size="large"
            style={{ width: "100%", height: "100%", alignItems: "center" }}
          />
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <>
      
      <div>
        <Space
          direction={"horizontal"}
          style={{
            margin: 5,
            paddingTop: 10,
            width: `${window.innerWidth * 0.4}px`,
          }}
        >
          {/* <span style={{ width: `${window.innerWidth * 0.4}px` }}>
            Показване на групова фаза
          </span> */}
          {/* <Switch
            onChange={(newValue: any) => {
              setDefSettings("showGroups", (newValue || false).toString())
              return setShowGroups(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          /> */}
          {/* <span style={{ width: `${window.innerWidth * 0.4}px` }}>
            Показване на кръг 1
          </span>
          <Switch
            onChange={(newValue: any) => {
              setDefSettings("showRound1", (newValue || false).toString())
              return setShowRound1(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showRound1}
          /> */}
        </Space>
      </div>
      <div>
        <Space direction={"horizontal"}>
          <OneMatchTable
            AllMatches={getMatchesForView(matches)}
            users={users}
            result={true}
          />
        </Space>
      </div>
    </>
  );
}
