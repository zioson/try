import { CheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import { Constants } from "@videosdk.live/react-sdk";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConferencingIcon from "../icons/ConferencingIcon";
import LiveStreamingIcon from "../icons/LiveStreamingIcon";

import { meetingTypes } from "../utils/common";

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
  meetingType,
  setMeetingType,
  setMeetingMode,
  meetingMode,
}) {
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  let routerMeetingType = query.get("meetingType");
  console.log("meetingType", routerMeetingType);
  const { id, mode } = useParams();
  const navigate = useNavigate();

  const [meetingId, setMeetingId] = useState(id || "");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  const selectType = [
    {
      Icon: ConferencingIcon,
      label: "Audio & Video Call",
      value: meetingTypes.MEETING,
    },
    {
      Icon: LiveStreamingIcon,
      label: "Interactive Live Streaming",
      value: meetingTypes.ILS,
    },
  ];

  useEffect(() => {
    if (meetingId) {
      setIsJoinMeetingClicked(true);
    } else {
      setIscreateMeetingClicked(false);
    }
  }, [meetingId]);

  useEffect(() => {
    if (mode) {
      setMeetingType(meetingTypes.ILS);
    }
  }, [mode]);

  useEffect(async () => {
    if (routerMeetingType === "conference") {
      setIscreateMeetingClicked(true);
      setMeetingType(meetingTypes.MEETING);
      const meetingId = await _handleOnCreateMeeting();
      setMeetingId(meetingId);
    } else if (routerMeetingType === "interactive") {
      setMeetingType(meetingTypes.ILS);
      setIscreateMeetingClicked(true);
      const meetingId = await _handleOnCreateMeeting();
      setMeetingId(meetingId);
    }
  }, [routerMeetingType]);

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {meetingType === meetingTypes.MEETING &&
        (iscreateMeetingClicked || isJoinMeetingClicked) && (
          <>
            <input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
            />

            {/* <p className="text-xs text-white mt-1 text-center">
           Your name will help everyone identify you in the meeting.
         </p> */}
            <button
              disabled={participantName.length < 3}
              className={`w-full ${
                participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
              }  text-white px-2 py-3 rounded-xl mt-5`}
              onClick={(e) => {
                if (iscreateMeetingClicked) {
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();
                  navigate(`/conference-meeting/${meetingId}`, {
                    replace: true,
                  });
                } else {
                  if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                    navigate(`/conference-meeting/${meetingId}`, {
                      replace: true,
                    });
                    setMeetingMode(Constants.modes.CONFERENCE);
                    onClickJoin(meetingId);
                  } else setMeetingIdError(true);
                }
              }}
            >
              {meetingType === meetingTypes.MEETING && iscreateMeetingClicked
                ? "Start a meeting"
                : "Join a meeting"}
            </button>
          </>
        )}

      {meetingType === meetingTypes.ILS &&
        (iscreateMeetingClicked || isJoinMeetingClicked) && (
          <>
            <input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
            />

            {/* <p className="text-xs text-white mt-1 text-center">
           Your name will help everyone identify you in the meeting.
         </p> */}
            <button
              disabled={participantName.length < 3}
              className={`w-full ${
                participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
              }  text-white px-2 py-3 rounded-xl mt-5`}
              onClick={(e) => {
                if (iscreateMeetingClicked) {
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();

                  navigate(`/interactive-meeting/host/${meetingId}`, {
                    replace: true,
                  });
                } else {
                  if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                    if (mode === "host") {
                      navigate(`/interactive-meeting/host/${meetingId}`, {
                        replace: true,
                      });
                    } else if (mode === "co-host") {
                      navigate(`/interactive-meeting/co-host/${meetingId}`, {
                        replace: true,
                      });
                    } else {
                      navigate(`/interactive-meeting/viewer/${meetingId}`, {
                        replace: true,
                      });
                      setMeetingMode(Constants.modes.VIEWER);
                    }
                    onClickJoin(meetingId);
                  } else setMeetingIdError(true);
                }
              }}
            >
              {meetingType === meetingTypes.ILS && iscreateMeetingClicked
                ? "Join Studio"
                : "Join Streaming Room"}
            </button>
          </>
        )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <p className="text-white text-2xl text-center font-extrabold">
            Select meeting type
          </p>
          <div className="flex flex-col justify-between w-full mt-8">
            {selectType.map(({ Icon, label, value }, index) => (
              <button
                onClick={(e) => {
                  setMeetingType(value);
                }}
                className={`bg-gray-650 py-5  flex flex-col items-center justify-center mb-5 rounded-xl ${
                  meetingType === value
                    ? "border border-white"
                    : "border border-gray-650"
                }`}
              >
                <Icon />
                <div className="mt-4">
                  <p
                    className={`text-base font-medium ${
                      meetingType === value
                        ? "text-white"
                        : "text-customGray-750"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex w-full">
            <button
              className="rounded-xl w-full py-4 bg-purple-350 text-center text-white text-xl font-bold"
              onClick={async (e) => {
                const meetingId = await _handleOnCreateMeeting();
                setMeetingId(meetingId);
                setIscreateMeetingClicked(true);
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex flex-1 flex-col w-full md:p-[6px] sm:p-1 p-1.5`}>
      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
          />

          {/* <p className="text-xs text-white mt-1 text-center">
            Your name will help everyone identify you in the meeting.
          </p> */}
          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
            }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                onClickStartMeeting();
                if (meetingType === meetingTypes.MEETING) {
                  navigate(`/conference-meeting/${meetingId}`, {
                    replace: true,
                  });
                } else {
                  navigate(`/interactive-meeting/host/${meetingId}`, {
                    replace: true,
                  });
                }
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  if (
                    (meetingType === meetingTypes.MEETING && mode === "") ||
                    null
                  ) {
                    navigate(`/conference-meeting/${meetingId}`, {
                      replace: true,
                    });
                    setMeetingMode(Constants.modes.CONFERENCE);
                  } else {
                    if (mode === "host") {
                      navigate(`/interactive-meeting/host/${meetingId}`, {
                        replace: true,
                      });
                    } else if (mode === "viewer") {
                      navigate(`/interactive-meeting/viewer/${meetingId}`, {
                        replace: true,
                      });
                      setMeetingMode(Constants.modes.VIEWER);
                    } else {
                      navigate(`/conference-meeting/${meetingId}`, {
                        replace: true,
                      });
                      setMeetingMode(Constants.modes.CONFERENCE);
                    }
                  }
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {meetingType === meetingTypes.MEETING
              ? iscreateMeetingClicked
                ? "Start a meeting"
                : "Join a meeting"
              : iscreateMeetingClicked
              ? "Start a meeting"
              : isJoinMeetingClicked &&
                meetingMode === Constants.modes.CONFERENCE
              ? "Join Studio"
              : "Join Streaming Room"}
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <p className="text-white text-2xl text-center font-extrabold">
            Select meeting type
          </p>
          <div className="flex flex-col justify-between w-full mt-8">
            {selectType.map(({ Icon, label, value }, index) => (
              <button
                onClick={(e) => {
                  setMeetingType(value);
                }}
                className={`bg-gray-650 py-5  flex flex-col items-center justify-center mb-5 rounded-xl ${
                  meetingType === value
                    ? "border border-white"
                    : "border border-gray-650"
                }`}
              >
                <Icon />
                <div className="mt-4">
                  <p
                    className={`text-base font-medium ${
                      meetingType === value
                        ? "text-white"
                        : "text-customGray-750"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex w-full">
            <button
              className="rounded-xl w-full py-4 bg-purple-350 text-center text-white text-xl font-bold"
              onClick={async (e) => {
                const meetingId = await _handleOnCreateMeeting();
                setMeetingId(meetingId);
                setIscreateMeetingClicked(true);
              }}
            >
              Next
            </button>
          </div>

          {/* <div className="flex items-center justify-center flex-col w-full mt-2">
            {meetingType === meetingTypes.ILS ? (
              <>
                <button
                  className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
                  onClick={async (e) => {
                    const meetingId = await _handleOnCreateMeeting();
                    setMeetingId(meetingId);
                    setIscreateMeetingClicked(true);
                    if (meetingType === meetingTypes.ILS) {
                      setMeetingMode(Constants.modes.CONFERENCE);
                    }
                  }}
                >
                  Create a meeting
                </button>

                <button
                  className="w-full bg-purple-350 text-white px-2 py-3 mt-5 rounded-xl"
                  onClick={async (e) => {
                    setIsJoinMeetingClicked(true);
                    if (meetingType === meetingTypes.ILS) {
                      setMeetingMode(Constants.modes.CONFERENCE);
                    }
                  }}
                >
                  Join as a Host
                </button>
                <button
                  className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
                  onClick={(e) => {
                    setIsJoinMeetingClicked(true);
                    if (meetingType === meetingTypes.ILS) {
                      setMeetingMode(Constants.modes.VIEWER);
                    }
                  }}
                >
                  Join as a Viewer
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
                  onClick={async (e) => {
                    const meetingId = await _handleOnCreateMeeting();
                    setMeetingId(meetingId);
                    setIscreateMeetingClicked(true);
                    if (meetingType === meetingTypes.ILS) {
                      setMeetingMode(Constants.modes.CONFERENCE);
                    }
                  }}
                >
                  Create a meeting
                </button>
                <button
                  className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
                  onClick={(e) => {
                    setIsJoinMeetingClicked(true);
                    if (meetingType === meetingTypes.ILS) {
                      setMeetingMode(Constants.modes.VIEWER);
                    }
                  }}
                >
                  Join a meeting
                </button>
              </>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}
