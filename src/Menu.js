import SideNav, {Toggle, NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
// import "./sidenav.css";

function MySideNav() {
    return <SideNav
        onSelect={selected=> {
            console.log(selected)
        }}
        >
            <SideNav.Toggle>
                <SideNav.Nav defaultSelected="home">
                    <NavItem>
                        <NavIcon><i className='fa fa-fw fa-home' style={{fontSize: 1.5}}></i></NavIcon>
                        <NavText>Home</NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav.Toggle>
    </SideNav>
}

export default MySideNav;