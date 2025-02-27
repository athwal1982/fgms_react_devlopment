import React from "react";
import ContentLoader from "react-content-loader";
import Skeleton from "react-loading-skeleton";

export const SkeletonCrmList = () => {
  return (
    <ContentLoader viewBox="0 0 500 495" height={275} width={280} speed={0}>
      <circle cx="70.2" cy="73.2" r="41.3" />
      <rect x="129.9" y="29.5" width="125.5" height="17" />
      <rect x="129.9" y="64.7" width="296" height="17" />
      <rect x="129.9" y="97.8" width="253.5" height="17" />
      <rect x="129.9" y="132.3" width="212.5" height="17" />

      <circle cx="70.7" cy="243.5" r="41.3" />
      <rect x="130.4" y="199.9" width="125.5" height="17" />
      <rect x="130.4" y="235" width="296" height="17" />
      <rect x="130.4" y="268.2" width="253.5" height="17" />
      <rect x="130.4" y="302.6" width="212.5" height="17" />

      <circle cx="70.7" cy="412.7" r="41.3" />
      <rect x="130.4" y="369" width="125.5" height="17" />
      <rect x="130.4" y="404.2" width="296" height="17" />
      <rect x="130.4" y="437.3" width="253.5" height="17" />
      <rect x="130.4" y="471.8" width="212.5" height="17" />
    </ContentLoader>
  );
};

export const SkeletonCrmDataV1 = () => {
  return <Skeleton duration={0} width={220} />;
};

export const SkeletonCrmDataV2 = () => {
  return <Skeleton duration={0} width={180} />;
};

export const SkeletonCrmTaxComData = () => {
  return (
    <div style={{ display: "grid", height: "100%", gridGap: "8px" }}>
      <p>
        <Skeleton duration={0} width={160} />
      </p>
      <p>
        <Skeleton duration={0} width={120} />
      </p>
      <p>
        <Skeleton duration={0} width={160} />
      </p>
      <p>
        <Skeleton duration={0} width={120} />
      </p>
    </div>
  );
};

export const SkeletonDtboxData = () => {
  return (
    <ContentLoader viewBox="0 0 900 300" height={300} speed={0} width={900}>
      <rect x="0" y="10" rx="0" ry="0" width="200" height="120" />
      <rect x="0" y="139" rx="0" ry="0" width="200" height="15" />
      <rect x="0" y="161" rx="0" ry="0" width="140" height="15" />
      <rect x="213" y="10" rx="0" ry="0" width="200" height="120" />
      <rect x="213" y="139" rx="0" ry="0" width="200" height="15" />
      <rect x="213" y="161" rx="0" ry="0" width="140" height="15" />
      <rect x="425" y="10" rx="0" ry="0" width="200" height="120" />
      <rect x="425" y="139" rx="0" ry="0" width="200" height="15" />
      <rect x="425" y="161" rx="0" ry="0" width="140" height="15" />
      <rect x="637" y="10" rx="0" ry="0" width="200" height="120" />
      <rect x="637" y="139" rx="0" ry="0" width="200" height="15" />
      <rect x="637" y="161" rx="0" ry="0" width="140" height="15" />
    </ContentLoader>
  );
};

export const SkeletonVersionBox = () => {
  return (
    <div className="ProjectMaster__ProjectVersionBox ProjectMaster__ProjectVersionSkeletonBox">
      <div className="ProjectMaster__PV_BorderBox"></div>
      <div className="ProjectMaster__PV_ContentBox">
        <p className="ProjectMaster__PV_ContentBoxHeadTxt">
          <h5>
            <Skeleton duration={0} width={160} height={12} />
          </h5>
          <pre>
            <Skeleton duration={0} width={80} height={12} />
          </pre>
        </p>
        <p className="ProjectMaster__PV_ContentBoxTxt">
          <pre>Project Manager</pre>
          <pre>
            <Skeleton duration={0} width={140} />
          </pre>
        </p>
        <p className="ProjectMaster__PV_ContentBoxTxt">
          <pre>Sale Person</pre>
          <pre>
            <Skeleton duration={0} width={170} />
          </pre>
        </p>
        <p className="ProjectMaster__PV_ContentBoxTxt">
          <pre>Period</pre>
          <pre>
            <Skeleton duration={0} width={200} />
          </pre>
        </p>
        <p className="ProjectMaster__PV_ContentBoxTxt">
          <pre>PO Details</pre>
          <pre>
            <Skeleton duration={0} width={178} />
          </pre>
        </p>
      </div>
    </div>
  );
};
