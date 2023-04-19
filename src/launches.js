import { useQuery, gql } from '@apollo/client';
import React, { useState } from 'react'

const GET_LAUNCHES = gql`
  query GetLaunches {
    launches {
      mission_name
      rocket {
        rocket_name
        rocket_type
      }
      launch_date_local
    }
  }
`;//資料形式

function formatDate(dateString) {//改成人類看得懂的時間
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  return `${formattedDate} ${formattedTime}`;
}

function Launches() {//處理、顯示資料
  const [searchText, setSearchText] = useState('');//搜尋
  const { loading, error, data } = useQuery(GET_LAUNCHES);//資料取得情形
  const [sortDirection, setSortDirection] = useState('asc');//排序方向
  const [sortColumn, setSortColumn] = useState('mission_name'); //排序欄位
  const [currentPage, setCurrentPage] = useState(1); //目前頁碼
  const pageSize = 20;//幾筆資料

  const toggleSort = (column) => {//切換排序方式
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const sortedData = [...data.launches]
    .filter((launch) => { //搜索 Mission Name	,Rocket Name, Rocket Type	的內容
      const searchTextLower = searchText.toLowerCase();
      return (
        launch.mission_name.toLowerCase().includes(searchTextLower) ||
        launch.rocket.rocket_name.toLowerCase().includes(searchTextLower) ||
        launch.rocket.rocket_type.toLowerCase().includes(searchTextLower)
      );
    })
    .sort((a, b) => {//排序資料（整個） 如果可以我認為請後端給我排序好的資料比較好，不然前端處理佔空間。
      const direction = sortDirection === 'asc' ? 1 : -1;
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];
      if (columnA < columnB) {
        return -1 * direction;
      }
      if (columnA > columnB) {
        return 1 * direction;
      }
      return 0;
    });
    
  const currentLaunches = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);//取得目前頁面顯示的資料

  const pages = Math.ceil(sortedData.length / pageSize);//計算頁數


  return (
    <div>
      <h2>Launches</h2>
        <div>
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('mission_name')}>
              Mission Name {sortColumn === 'mission_name' && (sortDirection === 'asc' ? '∧' : '∨')}
            </th>
            <th onClick={() => toggleSort('rocket.rocket_name')}>
              Rocket Name {sortColumn === 'rocket.rocket_name' && (sortDirection === 'asc' ? '∧' : '∨')}
            </th>
            <th onClick={() => toggleSort('rocket.rocket_type')}>
              Rocket Type {sortColumn === 'rocket.rocket_type' && (sortDirection === 'asc' ? '∧' : '∨')}
            </th>
            <th onClick={() => toggleSort('launch_date_local')}>
              Launch Date {sortColumn === 'launch_date_local' && (sortDirection === 'asc' ? '∧' : '∨')}
            </th>
          </tr>
        </thead>
        <tbody>
            {currentLaunches.map(launch => (
              <tr key={launch.mission_name}>
                <td>{launch.mission_name}</td>
                <td>{launch.rocket.rocket_name}</td>
                <td>{launch.rocket.rocket_type}</td>
                <td>{formatDate(launch.launch_date_local)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        {Array.from(Array(pages).keys()).map(page => (//頁碼
          <button key={page} onClick={() => setCurrentPage(page + 1)}>
            {page + 1}
          </button>
        ))}
      </div>
      <div>Current Page: {currentPage}</div>

    </div>
  );
}

export default Launches;