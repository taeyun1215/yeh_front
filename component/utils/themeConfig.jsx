import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#ffffff",
  text: "#363537",
  toggleBorder: "#ffffff",
  DivBg: "#f8f8f8",
  DivBorder: "1px #dedede solid",
  mainInfo: "#424242",
  addInfo: "#424242",
  pageLeft: "rgba(0, 0, 0, 0.25) !important",
  pageRight: "rgba(0, 0, 0, 0.88) !important",
  pageNum: "#000000 !important",
  themeIconColor: "#424242",
  themeBorder: "1px #424242 solid",
  Cancletext: "#2b3089",
};

export const darkTheme = {
  body: "#292a2d",
  text: "#d9d9d9",
  toggleBorder: "#6B8096",
  DivBg: "#35363a",
  DivBorder: "1px #3a3b3d solid",
  mainInfo: "#a8a8a8",
  addInfo: "#94969b",
  pageLeft: "#a8a8a8 !important",
  pageRight: "#ffffff !important",
  pageNum: "#ffffff !important",
  pageNum_NotAcive: "#a8a8a8",
  themeIconColor: "#94969b",
  themeBorder: "1px #94969b solid",
  Cancletext: "#d9d9d9",
  Skeleton: "#3a3b3d",
};

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  // 실시간 인기 글 배경 색
  div &.ranking  {
    background-color: ${({ theme }) => theme.DivBg};
  }

  // 게시글 박스 테두리 선 색상
  div &.getPost &.getPostsBox_wrap &.getPostsBox {
    border : ${({ theme }) => theme.DivBorder};
  }

  // 게시글 박스 내 내용 글 색상
  &.getPost &.getPostsBox_wrap &.getPostsBox 
    &.mainInfo &.mainInfoText &.mainInfoContents {
    color : ${({ theme }) => theme.mainInfo};
  }

  // 게시글 박스 내 아이콘 옆 글 색상
  &.getPost &.getPostsBox_wrap &.getPostsBox &.addInfo &.addInfo_wrap p{
    color : ${({ theme }) => theme.addInfo};
  }

  // 게시글 박스 내 아이콘 색상
  &.getPost &.getPostsBox_wrap &.getPostsBox &.addInfo &.addInfo_wrap &.addInfoIcons {
    color : ${({ theme }) => theme.addInfo};
  }

  // 페이지네이션 왼쪽 화살표 색상 
  &.ant-pagination &.ant-pagination-prev &.ant-pagination-item-link {
    color : ${({ theme }) => theme.pageLeft};
  }

  // 페이지네이션 오른쪽 화살표 색상
  &.ant-pagination &.ant-pagination-next &.ant-pagination-item-link {
    color : ${({ theme }) => theme.pageRight};
  }

  // 페이지네이션 현재 페이지 숫자 색상 
  &.ant-pagination &.ant-pagination-item-active a {
    color : ${({ theme }) => theme.pageNum};
  }

  // 페이지네이션 현재가 아닌 페이지 숫자 색상 
  &.ant-pagination &.ant-pagination-item a {
    color : ${({ theme }) => theme.pageNum_NotAcive};
  }

  // 테마 변경 토글 버튼 테두리 색상
  &.side_btns {
    border : ${({ theme }) => theme.themeBorder};
  }

  // 테마 변경 토글 버튼 아이콘 색상
  &.side_btns &.side_btns_icons {
    color : ${({ theme }) => theme.themeIconColor};
  }

  // 푸터 박스 색상
  &.detailPost &.detailPostBox &.detailPostBox_footer &.detailPostBox_footer_info button  {
    color : ${({ theme }) => theme.text};
  }

  // 푸터 글 색상
  &.detailPost &.detailPostBox &.detailPostBox_footer p {
    color : ${({ theme }) => theme.text};
  }

  // 대댓글 버튼 색상
  &.postComments &.postComments_wrap &.nestedComments_active button {
    color : ${({ theme }) => theme.text};
  }

  // 대댓글 박스 색상
  &.postComments &.postComments_wrap &.nestedComments {
    background-color :  ${({ theme }) => theme.DivBg};
  }

  &.header &.header_signBtn &.header_user {
    color : ${({ theme }) => theme.text};
  }
  
  &.comments_input button, &.post &.postContents {
    color : ${({ theme }) => theme.text};
  }

  input {
    color : ${({ theme }) => theme.text};
  }
  .footer {
    border-top : ${({ theme }) => theme.DivBorder};
  }
  &.post &.postBtn &.cancle {
    color : ${({ theme }) => theme.Cancletext};
  }
  
  // 헤더 색상
  &.header {
    background-color: ${({ theme }) => theme.body};

  }
  &.header &.header_signBtn &.header_signin, &.header_signin_divide,
  &.header &.header_wrap &.header_search button {
    color : ${({ theme }) => theme.Cancletext};
  }

  // skeleton 색상 
  &.ant-skeleton .ant-skeleton-content .ant-skeleton-title,
  &.ant-skeleton .ant-skeleton-content .ant-skeleton-paragraph >li {
    background : ${({ theme }) => theme.Skeleton};
  }
`;
