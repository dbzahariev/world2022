import React, { useEffect, useState } from "react";
import {
  MatchType,
  ScoreType,
  stylingTable,
  UsersType,
  getPoints
} from "../../helpers/OtherHelpers";
import OneMatchTable from "../OneMatchTable";
import rankingImg4 from "./rankingImg_4_ranks.svg";
import rankingImg5 from "./rankingImg_5_ranks.svg";
import rankingImg6 from "./rankingImg_6_ranks.svg";
import rankingImg7 from "./rankingImg_7_ranks.svg";
import rankingImg8 from "./rankingImg_8_ranks.svg";
import rankingImg9 from "./rankingImg_9_ranks.svg";
import rankingImg10 from "./rankingImg_10_ranks.svg";
import backup2020 from "./Backup2020.json";
import backup2018 from "./Backup2018.json";
import backup2016 from "./Backup2016.json";
import { Select, Space, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { translateTeamsName } from "../../helpers/Translate";
import { useGlobalState } from "../../GlobalStateProvider";

const { Option } = Select;

const years = [
  { value: "2022", name: { eng: "World 2022", bg: "Световно 2022" } },
  { value: "2020", name: { eng: "Euro 2020", bg: "Евро 2020" } },
  { value: "2018", name: { eng: "World 2018", bg: "Световно 2018" } },
  { value: "2016", name: { eng: "Euro 2016", bg: "Евро 2016" } },
];

export default function Ranking() {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [showGroups, setShowGroups] = useState(true);
  const [competitionValue, setCompetitionValue] = useState<string>("2022");
  const [backup2022, setBackup2022] = useState<{
    matches: any[];
    users: any[];
  }>({ matches: [], users: [] })

  const { state } = useGlobalState()

  const matchesFromState = state.matches || []
  const usersrFomState = state.users || []

  const genBackup2022 = () => {
    setBackup2022({ matches: matchesFromState, users: getPoints(usersrFomState, matchesFromState) })
  }

  useEffect(() => {
    setTimeout(() => {
      setMatches(matchesFromState)
    }, 1);

    setTimeout(() => {
      setUsers(usersrFomState)
    }, 1);

    genBackup2022()
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (matches.length !== 0 && users.length === 0) {
      setUsers(getPoints(usersrFomState, matches))
    }
    // eslint-disable-next-line 
  }, [matches, users])

  useEffect(() => {
    getMatches();
    getUsers();
    // eslint-disable-next-line
  }, [competitionValue])

  useEffect(() => {
    stylingTable(users);
  }, [showGroups, users]);

  const getMatches = () => {
    getUsers()
    let matchesFromBackup: MatchType[] = [];

    let selectedBackup = backup2022;

    if (competitionValue === years[0].value) {
      selectedBackup = backup2022
    }
    if (competitionValue === years[1].value) {
      selectedBackup = backup2020;
    }
    if (competitionValue === years[2].value) {
      selectedBackup = backup2018;
    }
    if (competitionValue === years[3].value) {
      selectedBackup = backup2016;
    }

    selectedBackup.matches.forEach((el) => {
      let matchToAdd: MatchType = {
        number: el.number,
        key: el.key,
        id: el.id,
        homeTeam: el.homeTeam,
        awayTeam: el.awayTeam,
        utcDate: new Date(el.utcDate),
        status: el.status,
        score: el.score as ScoreType,
        homeTeamScore: el.homeTeamScore,
        awayTeamScore: el.awayTeamScore,
        group: el.group,
      };

      matchesFromBackup.push(matchToAdd);
    });
    setMatches(matchesFromBackup);
  };

  const getUsers = () => {
    let usersFromBackup: UsersType[] = [];

    let selectedBackup = backup2022;

    if (competitionValue === years[0].value) {
      selectedBackup = backup2022;
    }
    if (competitionValue === years[1].value) {
      selectedBackup = backup2020;
    }
    if (competitionValue === years[2].value) {
      selectedBackup = backup2018;
    }
    if (competitionValue === years[3].value) {
      selectedBackup = backup2016;
    }

    selectedBackup.users.forEach((el) => {
      let userToAdd: UsersType = {
        name: el.name,
        bets: el.bets as any[],
        index: el.index,
        finalWinner: el.finalWinner,
        colorTable: el.colorTable,
        totalPoints: el.totalPoints,
      };
      usersFromBackup.push(userToAdd);
    });
    setUsers(usersFromBackup);
  };

  const getPaddingLeft = () => {
    let res = "38%";
    if (users.length === 4) {
      res = "38%";
    }
    if (users.length === 5) {
      res = "75%";
    }
    return res;
  };

  const getRankingImg = () => {
    if (users.length === 4) {
      return rankingImg4;
    }
    if (users.length === 5) {
      return rankingImg5;
    }
    if (users.length === 6) {
      return rankingImg6;
    }
    if (users.length === 7) {
      return rankingImg7;
    }
    if (users.length === 8) {
      return rankingImg8;
    }
    if (users.length === 9) {
      return rankingImg9;
    }
    if (users.length === 10) {
      return rankingImg10;
    }
  };

  const getSortedUsers = () => {
    let res = users
      .sort((a, b) => b.index - a.index)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return res;
  };

  const oneHuman = (user: UsersType, color2: string) => {
    if (user === undefined) {
      return null;
    }
    return (
      <p
        style={{ color: color2, fontSize: "15px", whiteSpace: "nowrap" }}
      >{`${user.name} (${user.totalPoints})`}</p>
    );
  };

  const ranking = () => {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: `${784 * 0.6}px`,
          height: `${487 * 0.6}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            paddingLeft: "25%",
            paddingTop: "10%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[1], "#1F88C9")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "50%",
            top: 0,
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[0], "#9EB644")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "73%",
            paddingTop: "17%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[2], "#E24786")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "9%",
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[3], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: getPaddingLeft(),
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[4], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "62%",
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[5], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "87%",
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[6], "#FFB800")}
        </div>

        <img
          src={getRankingImg()}
          alt="Separator"
          style={{
            marginTop: "6%",
            justifyContent: "center",
            display: "flex",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    );
  };

  const handleChangeForSelector = (value: any) => {
    setCompetitionValue(value);
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: "1%",
      }}
    >
      <Select
        style={{
          marginLeft: 20,
          width: "240px",
          marginTop: 10,
          marginBottom: 10,
        }}
        value={competitionValue}
        onChange={handleChangeForSelector}
      >
        {/* <Option value="">Избери година</Option> */}
        {years.map((year) => {
          return (
            <Option key={year.value} value={year.value}>
              {year.name.bg}
            </Option>
          );
        })}
      </Select>
      {ranking()}
      <div style={{ marginTop: "50px" }}>
        <Space
          direction={"horizontal"}
          style={{
            margin: 5,
            paddingTop: 10,
            width: `${window.innerWidth * 0.4}px`,
          }}
        >
          <span style={{ width: `${window.innerWidth * 0.4}px` }}>
            {translateTeamsName("Show group phase")}
          </span>
          <Switch
            onChange={(newValue: any) => setShowGroups(newValue)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          />
        </Space>
        <OneMatchTable
          AllMatches={matches}
          users={users}
          result={true}
        />
      </div>
    </div>
  );
}
