import React, { SVGProps } from 'react';

export const LinkedInIcon = React.forwardRef<any, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        width={32}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect width={32} height={32} rx={8} fill="#006CEC" fillOpacity="0.1" />
        <path
          d="M22.9967 23V22.9994H23.0002V17.8649C23.0002 15.3531 22.4595 13.4182 19.523 13.4182C18.1113 13.4182 17.164 14.1928 16.7772 14.9273H16.7364V13.6527H13.9521V22.9994H16.8513V18.3713C16.8513 17.1527 17.0823 15.9743 18.5914 15.9743C20.0783 15.9743 20.1005 17.365 20.1005 18.4494V23H22.9967Z"
          fill="#0077B5"
        />
        <path d="M9.23096 13.6533H12.1336V23H9.23096V13.6533Z" fill="#0077B5" />
        <path
          d="M10.6812 9C9.75308 9 9 9.75308 9 10.6812C9 11.6092 9.75308 12.3781 10.6812 12.3781C11.6092 12.3781 12.3623 11.6092 12.3623 10.6812C12.3617 9.75308 11.6087 9 10.6812 9V9Z"
          fill="#0077B5"
        />
      </svg>
    );
  }
);
