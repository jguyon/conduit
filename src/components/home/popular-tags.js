// @flow

import * as React from "react";
import Request from "../request";
import {
  StyledContainerAside,
  StyledTagLoadingError,
  StyledTags,
  StyledTagItem
} from "./styles";
import * as api from "../../lib/api";

type PopularTagsProps = {|
  activeTag: ?string,
  onTagClick: string => void
|};

const PopularTags = React.memo<PopularTagsProps>(props => (
  <StyledContainerAside>
    <StyledTags>
      <Request load={api.listTags}>
        {request => {
          switch (request.status) {
            case "pending":
              return (
                <>
                  <StyledTagItem placeholder size={3} />
                  <StyledTagItem placeholder size={2} />
                  <StyledTagItem placeholder size={4} />
                  <StyledTagItem placeholder size={3} />
                  <StyledTagItem placeholder size={3} />
                  <StyledTagItem placeholder size={2} />
                  <StyledTagItem placeholder size={3} />
                  <StyledTagItem placeholder size={2} />
                  <StyledTagItem placeholder size={4} />
                  <StyledTagItem placeholder size={2} />
                  <StyledTagItem placeholder size={3} />
                  <StyledTagItem placeholder size={3} />
                  <StyledTagItem placeholder size={4} />
                  <StyledTagItem placeholder size={3} />
                </>
              );

            case "error":
              return <StyledTagLoadingError />;

            case "success":
              const tags = request.data;

              return tags.map(tag => (
                <StyledTagItem
                  key={tag}
                  name={tag}
                  testId={`tag-${tag}`}
                  active={tag === props.activeTag}
                  onClick={() => props.onTagClick(tag)}
                />
              ));

            default:
              throw new Error("invalid status");
          }
        }}
      </Request>
    </StyledTags>
  </StyledContainerAside>
));

export default PopularTags;
