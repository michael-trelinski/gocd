/*
 * Copyright 2019 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import m from "mithril";
import {TestHelper} from "../../spec/test_helper";
import {BuildCauseWidget} from "../build_cause_widget";
import Stream from "mithril/stream";
import {PipelineRunInfo} from "models/pipeline_activity/pipeline_activity";
import {PipelineActivityData} from "models/pipeline_activity/spec/test_data";

describe("BuildCauseWidget", () => {
  const helper           = new TestHelper();
  const showBuildCaseFor = Stream<string>();
  const show             = Stream<boolean>(false);

  beforeEach(() => {
    showBuildCaseFor("");
    show(false);
  });

  afterEach(helper.unmount.bind(helper));

  it("should render text trigger by changes", () => {
    const pipelineRunInfo = PipelineRunInfo.fromJSON(PipelineActivityData.pipelineRunInfo());
    mount(pipelineRunInfo);

    expect(helper.byTestId("trigger-with-changes-button")).toBeInDOM();
    expect(helper.byTestId("trigger-with-changes-button")).toHaveText(pipelineRunInfo.buildCauseBy());
  });

  it("should open popup on click of trigger with button", () => {
    const pipelineRunInfo = PipelineRunInfo.fromJSON(PipelineActivityData.pipelineRunInfo());
    mount(pipelineRunInfo);

    expect(helper.byTestId("build-details")).not.toBeInDOM();
    helper.clickByTestId("trigger-with-changes-button");

    expect(helper.byTestId("build-details")).toBeInDOM();
  });

  it("should toggle popup on click of trigger with button", () => {
    const pipelineRunInfo = PipelineRunInfo.fromJSON(PipelineActivityData.pipelineRunInfo());
    mount(pipelineRunInfo);

    expect(helper.byTestId("build-details")).not.toBeInDOM();

    helper.clickByTestId("trigger-with-changes-button");
    expect(helper.byTestId("build-details")).toBeInDOM();

    helper.clickByTestId("trigger-with-changes-button");
    expect(helper.byTestId("build-details")).not.toBeInDOM();
  });

  it("should close the popup on click of close button", () => {
    const pipelineRunInfo = PipelineRunInfo.fromJSON(PipelineActivityData.pipelineRunInfo());
    mount(pipelineRunInfo);

    expect(helper.byTestId("build-details")).not.toBeInDOM();

    helper.clickByTestId("trigger-with-changes-button");
    expect(helper.byTestId("build-details")).toBeInDOM();

    helper.clickByTestId("build-details-close-btn");
    expect(helper.byTestId("build-details")).not.toBeInDOM();
  });

  it("should render material header in popup", () => {
    const pipelineRunInfo = PipelineRunInfo.fromJSON(PipelineActivityData.pipelineRunInfo());
    mount(pipelineRunInfo);

    helper.clickByTestId("trigger-with-changes-button");

    pipelineRunInfo.materialRevisions().forEach((revision, index) => {
      const materialRevisionDiv = helper.byTestId(`material-revision-${index}`);
      expect(helper.byTestId("material-header", materialRevisionDiv)).toBeInDOM();
      expect(helper.byTestId("material-header", materialRevisionDiv)).toContainText(revision.scmType());
      expect(helper.byTestId("material-header", materialRevisionDiv)).toContainText(revision.location());
    });
  });

  it("should render material revisions in popup", () => {
    const pipelineRunInfo = PipelineRunInfo.fromJSON(PipelineActivityData.pipelineRunInfo());
    mount(pipelineRunInfo);

    helper.clickByTestId("trigger-with-changes-button");

    pipelineRunInfo.materialRevisions().forEach((revision) => {
      revision.modifications().forEach(modification => {
        const modificationDiv = helper.byTestId(`modification-${modification.revision()}`);
        expect(helper.byTestId("user", modificationDiv)).toHaveText(modification.user());
        expect(helper.byTestId("revision", modificationDiv)).toContainText(modification.revision());
        expect(helper.byTestId("comment", modificationDiv)).toContainText(modification.comment());
      });
    });
  });

  function mount(pipelineRunInfo: PipelineRunInfo) {
    return helper.mount(() => <BuildCauseWidget showBuildCaseFor={showBuildCaseFor}
                                                pipelineRunInfo={pipelineRunInfo}
                                                show={show}/>);
  }
});