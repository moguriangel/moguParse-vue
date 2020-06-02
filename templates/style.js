exports.css = `
body {
  background: #F6F6F2;
}
p {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}
a, a:hover, a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}
.navbar {
  padding: 15px 10px;
  background: #F6F6F2;
  border: none;
  border-radius: 0;
  margin-bottom: 40px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}
.navbar-btn {
  box-shadow: none;
  outline: none !important;
  border: none;
}
.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ddd;
  margin: 40px 0;
}
.primary-bg{
  background-color: #388087;
 }
 .primary-text{
   color: #388087;
  }
.primary-dark-bg{
 background-color: #14494E;
}
.primary-dark-text{
  color: #14494E;
 }
 .primary-light-bg{
  background-color: #BADFE7;
 }
 .primary-light-text{
   color: #BADFE7;
  }
.white-bg {
  background-color: #F6F6F2;
}
.white-text {
  color: #F6F6F2;
}
.secondary-bg{
  background-color: #C2EDCE;
}
.secondary-text{
  color: #C2EDCE;
}
/* ---------------------------------------------------
  SIDEBAR STYLE
----------------------------------------------------- */
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
  perspective: 1500px;
}
#sidebar {
  min-width: 320px;
  max-width: 320px;
  background: #388087;
  color: #F6F6F2;
  transition: all 0.6s cubic-bezier(0.945, 0.020, 0.270, 0.665);
  transform-origin: bottom left;
  position: fixed;
  height: 100vh;
  z-index: 100;
}
#sidebar.active {
  margin-left: -290px;
  padding-right: 30px;
}
#sidebar .sidebar-header {
  padding: 20px;
  background: #34777d;
}
#sidebar ul.components {
  padding: 20px 0;
  border-bottom: 1px solid #47748b;
}
#sidebar ul p {
  color: #F6F6F2;
  padding: 10px;
}
#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}
#sidebar ul li a:hover {
  color: #388087;
  background: #F6F6F2;
}
#sidebar ul li.active > a, a[aria-expanded="true"] {
  color: #F6F6F2;
  background: #34777d;
}
a[data-toggle="collapse"] {
  position: relative;
}
.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}
a.active{
  color: #34777d ;
  background-color: #F6F6F2 ;
}
/* ---------------------------------------------------
  CONTENT STYLE
----------------------------------------------------- */
#content {
  width: 100%;
  padding: 20px;
  min-height: 100vh;
  transition: all 0.3s;
  margin-left: 320px;
  transition: all 0.6s cubic-bezier(0.945, 0.020, 0.270, 0.665);
}
#content.active {
  margin-left: 30px
}
#sidebarCollapse {
  width: 30px;
  height: 30px;
  background: #388087;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 280px;
  border-radius: 20px;
  z-index: 100;
  transition: all 0.6s cubic-bezier(0.945, 0.020, 0.270, 0.665);
}
#sidebarCollapse #icon {
  color: #F6F6F2;
  transition: all 0.8s cubic-bezier(0.810, -0.330, 0.345, 1.375);
  transition-delay: 0.2s;
  transform: rotateY(0deg);
}
#sidebarCollapse.active {
  left: 290px;
}
#sidebarCollapse.active #icon {
  transform: rotateZ(180deg);
}
.table {
  color: #14494E;
}
.table-striped tbody tr:nth-of-type(odd) {
 background-color: #BADFE7;
}
/* ---------------------------------------------------
  MEDIAQUERIES
----------------------------------------------------- */
@media (max-width: 768px) {
  #sidebar {
      margin-left: -290px;
      padding-right: 30px;
  }
  #sidebar.active {
    margin-left: 0;
    transform: none;
    padding-right: 0px;
  }
  #content {
      margin-left: 30px
  }
  #content.active{
      margin-left: 320px;
  }
  #sidebarCollapse #icon {
      transform: rotateZ(180deg);
  }
  #sidebarCollapse.active {
      left: 280px;
  }
  #sidebarCollapse {
    left: 290px;
  }
  #sidebarCollapse.active #icon {
      color: #F6F6F2;
      transition: all 0.8s cubic-bezier(0.810, -0.330, 0.345, 1.375);
      transition-delay: 0.2s;
      transform: rotateY(0deg);
  }
}
`