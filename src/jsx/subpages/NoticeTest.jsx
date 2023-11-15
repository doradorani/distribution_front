import React from "react";
import "../../css/subpage/notice.css";

const NoticeText = () => {
  return (
    <div className="notice_wrap">
      <div>
        <img
          className="notice_main_img"
          src="/test_imgs/notice_imgs/notice_board2.jpg"
        />
      </div>
      <div className="community_flex">
        <div class="bcmdjH">
          <div>
            <div class="fnCVSl">
              <div class="dtlarc">
                전체
              </div>
            </div>
            <div class="fnCVSl">
              <div class="edGsGa">
                Travel Story
              </div>
            </div>
            <div class="fnCVSl">
              <div class="edGsGa">
                Member Talk
              </div>
            </div>
            <div class="fnCVSl">
              <div class="edGsGa">
                내 게시글
              </div>
            </div>
          </div>
          <div class="jcMbpr"></div>
          <div class="iSzXjg">
            <div class="fwMqfj"></div>
            <button
              type="button"
              class="gSbZJZ"
            >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ minWidth: '20px', minHeight: '20px' }}
            >
                <path
                  fill="#ffffff"
                  fill-rule="evenodd"
                  d="M11.7408,7.1835 L16.8168,12.2585 L8.8748,20.2005 C8.7918,20.2835 8.6808,20.3345 8.5628,20.3445 L8.5628,20.3445 L3.7918,20.7445 C3.4858,20.7695 3.2308,20.5145 3.2558,20.2085 L3.2558,20.2085 L3.6548,15.4365 C3.6648,15.3185 3.7158,15.2085 3.7998,15.1245 L3.7998,15.1245 L11.7408,7.1835 Z M15.1945,3.7292 C15.8295,3.0952 16.8565,3.0952 17.4905,3.7292 L17.4905,3.7292 L20.2705,6.5092 C20.9045,7.1432 20.9045,8.1712 20.2705,8.8042 L20.2705,8.8042 L17.9265,11.1492 L12.8505,6.0732 Z"
                ></path>
              </svg>
              <div
                class="fgKcdr"
              ></div>
              <div class="knaMOB">
                새 글 작성
              </div>
            </button>
          </div>
          <div class="iVSuAL"></div>
          <div>
            <div class="fnCVSl">
              <div class="edGsGa">
                #Let's trip!
              </div>
            </div>
            <div class="fnCVSl">
              <div class="edGsGa">
                #Scenery
              </div>
            </div>
            <div class="fnCVSl">
              <div class="edGsGa">
                #Foodie
              </div>
            </div>
            <div class=" fnCVSl">
              <div class="edGsGa">
                #My Travel
              </div>
            </div>
            <div class="fnCVSl">
              <div class="edGsGa">
                #Daily
              </div>
            </div>
          </div>
          <div class="hVuTa-D"></div>
          <div class="kSOWIf"></div>
        </div>

        <div>
          <div>left</div>
        </div>
        <div>
          <div>전체</div>
          <div></div>
        </div>
        <div>
          <div>right</div>
        </div>
      </div>
    </div>
  );
};

export default NoticeText;
