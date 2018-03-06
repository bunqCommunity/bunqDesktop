import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import Icon from "material-ui/Icon";

export default props => {
    const { category } = props;

    return (
        <Chip
            // style={{
            //     backgroundColor: category.color
            // }}
            label={category.label}
            onDelete={console.log}
            avatar={
                <Avatar
                    style={{
                        backgroundColor: category.color
                    }}
                >
                    <Icon
                        style={{
                            height: 23,
                            width: 23
                        }}
                    >
                        {category.icon}
                    </Icon>
                </Avatar>
            }
        />
    );
};
