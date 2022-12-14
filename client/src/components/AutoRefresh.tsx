import React, { useEffect, useState } from "react";
import { Button, Checkbox, InputNumber, Modal, Space } from "antd";
import { translateTeamsName } from "../helpers/Translate";

export let AutoRefreshInterval: number | "disable" | "init" = "init";

export default function AutoRefresh({ refresh }: { refresh: Function }) {
  const [newInterval, setNewInterval] = useState(AutoRefreshInterval);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChangeAllowRefresh = (event: any) => {
    let newValue = event.target.checked;
    let newInterval2: number | "disable";
    if (newValue) {
      newInterval2 = 30;
    } else {
      newInterval2 = "disable";
    }
    setNewInterval(newInterval2);
  };

  useEffect(() => {
    if (newInterval !== "disable") {
      if (newInterval !== "init") {
        AutoRefreshInterval = newInterval
      }
    }
  }, [newInterval])

  useEffect(() => {
    if (newInterval !== "init") {
      refresh()
    }
    // eslint-disable-next-line
  }, [isModalOpen])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>
        {translateTeamsName("Auto reload")}
      </Button>
      <Modal title={translateTeamsName("Auto reload")} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
        footer={[
          <Button style={{ borderRadius: "10px" }} type="primary" key="ok"
            onClick={handleOk}>
            Ок
          </Button>]}>
        <Space direction={"horizontal"}>
          <Space direction={"horizontal"}>
            <Checkbox
              onChange={onChangeAllowRefresh}
              defaultChecked={newInterval !== "disable"}
            >
              {translateTeamsName("Auto reload")}
            </Checkbox>
            <InputNumber
              disabled={newInterval === "disable"}
              min={3}
              step={5}
              max={5 * 60}
              defaultValue={30}
              value={(newInterval === "disable") || (newInterval === "init") ? 30 : newInterval}
              onChange={(value: number | null) => {
                if (value) setNewInterval(value);
              }}
              bordered={false}
            />
          </Space>
        </Space>
      </Modal>
    </>

  );
}
