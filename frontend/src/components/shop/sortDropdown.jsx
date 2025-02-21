import Dropdown from "react-bootstrap/Dropdown";

const SortDropdown = ({ active, onSort }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="transparent"
        id="sort-dropdown"
        className="border color-main-black"
      >
        <span className="text-secondary">Xếp theo: </span>
        {active === 1
          ? "Giá, thấp tới cao"
          : active === -1
          ? "Giá, cao tới thấp"
          : "Mặc định"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onSort(0)}>Mặc định</Dropdown.Item>
        <Dropdown.Item onClick={() => onSort(1)}>
          Giá, thấp tới cao
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onSort(-1)}>
        Giá, cao tới thấp
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortDropdown;
