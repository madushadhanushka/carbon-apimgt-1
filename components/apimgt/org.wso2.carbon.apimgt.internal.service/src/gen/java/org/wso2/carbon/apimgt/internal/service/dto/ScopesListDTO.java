package org.wso2.carbon.apimgt.internal.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;


import io.swagger.annotations.*;
import java.util.Objects;




public class ScopesListDTO   {
  
    private Integer count = null;
    private List<ScopeDTO> list = new ArrayList<>();
    private PaginationDTO pagination = null;

  /**
   * Number of Scopes returned. 
   **/
  public ScopesListDTO count(Integer count) {
    this.count = count;
    return this;
  }

  
  @ApiModelProperty(example = "1", value = "Number of Scopes returned. ")
  @JsonProperty("count")
  public Integer getCount() {
    return count;
  }
  public void setCount(Integer count) {
    this.count = count;
  }

  /**
   **/
  public ScopesListDTO list(List<ScopeDTO> list) {
    this.list = list;
    return this;
  }

  
  @ApiModelProperty(value = "")
  @JsonProperty("list")
  public List<ScopeDTO> getList() {
    return list;
  }
  public void setList(List<ScopeDTO> list) {
    this.list = list;
  }

  /**
   **/
  public ScopesListDTO pagination(PaginationDTO pagination) {
    this.pagination = pagination;
    return this;
  }

  
  @ApiModelProperty(value = "")
  @JsonProperty("pagination")
  public PaginationDTO getPagination() {
    return pagination;
  }
  public void setPagination(PaginationDTO pagination) {
    this.pagination = pagination;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ScopesListDTO scopesList = (ScopesListDTO) o;
    return Objects.equals(count, scopesList.count) &&
        Objects.equals(list, scopesList.list) &&
        Objects.equals(pagination, scopesList.pagination);
  }

  @Override
  public int hashCode() {
    return Objects.hash(count, list, pagination);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ScopesListDTO {\n");
    
    sb.append("    count: ").append(toIndentedString(count)).append("\n");
    sb.append("    list: ").append(toIndentedString(list)).append("\n");
    sb.append("    pagination: ").append(toIndentedString(pagination)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

